
//MODULES
require('dotenv').config();
const {MongoClient} = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const router = express.Router();

app.use(cors());

//Existing floors 
const floorNr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

//DATABASE
async function elevatorGetData() {
    let uri = process.env.DB_uri;
    const client = new MongoClient(uri);
    try {
        await client.connect(); 
        let elevator1 = await getStatusByName(client, 1); let elevator2 = await getStatusByName(client, 2); let elevator3 = await getStatusByName(client, 3);
        return [elevator1[0], elevator2[0], elevator3[0], elevator1[1], elevator2[1], elevator3[1]];
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
 
async function getStatusByName(client, nameOfElevator) {
    const result = await client.db("Hotell").collection("Elevators and their status").findOne({ Elevator: nameOfElevator });
    if(result) {
        if (nameOfElevator == 1) { return [result.Floor, result.Status]; }
        else if (nameOfElevator == 2) { return [result.Floor, result.Status]; }
        else if (nameOfElevator == 3) { return [result.Floor, result.Status]; }
    }
}
 
async function updateStatusByName(client, nameOfElevator, updatedStatus) {
    await client.db("Hotell").collection("Elevators and their status").updateOne({ Elevator: nameOfElevator }, { $set: updatedStatus });
    await client.db("Hotell").collection("Elevators and their status").updateOne({ Status: nameOfElevator }, { $set: updatedStatus });
} 

 
//ELEVATORS
function elevator(elevator, floor, res) {
    elevatorGetData().then(function(result) {
        let elevatorFloor = result[elevator-11]; let i = elevatorFloor-1; let elevatorStatus = result[elevator-7];

        if (floor == elevatorFloor) {res.json(100);}
        else if (Math.abs(floor-elevatorFloor)<2) {res.json(100);}
        else {res.json(elevator-10);}


        
        const intervalID = setInterval(whichFloor, 2000);
        function whichFloor()
        {
            if (floor>elevatorFloor) { 
                i++;
                elevatorFloor = floorNr[i]; elevatorStatus = `Elevator is running`;
                elevatorUpdateData(elevator).catch(console.error);
                if (floor == elevatorFloor) { stopE(res); }
            }
            else if (floor<elevatorFloor) { 
                i--;   
                elevatorFloor = floorNr[i]; elevatorStatus = `Elevator is running`; 
                elevatorUpdateData(elevator).catch(console.error);
                if (floor == elevatorFloor) { stopE(res); } 
            }
            return elevatorStatus;
        }

        async function elevatorUpdateData(elevator) {
            let uri = process.env.DB_uri;
            const client = new MongoClient(uri);
            try {
                await client.connect(); 
                if (elevator === 11) {await updateStatusByName(client, 1, {Floor: elevatorFloor, Status: elevatorStatus})}
                else if (elevator === 12) {await updateStatusByName(client, 2, {Floor: elevatorFloor, Status: elevatorStatus})}
                else if (elevator === 13) {await updateStatusByName(client, 3, {Floor: elevatorFloor, Status: elevatorStatus})}
            } catch (e) {
                console.error(e);
            } finally {
                await client.close();
            }
        }

        function stopE(res) {
            clearInterval(intervalID);
            elevatorStatus = `Elevator is standing still`;
            elevatorUpdateData(elevator).catch(console.error);
            return elevatorStatus;
        } 
    })
}


//ENDPOINTS
app.get('/api/elevators_status', (req, res) => {
    elevatorGetData().then(function(result) {
    res.json({"elevatorStatus":result});
}); });



router.get('/api/call_elevator_to/:floor', (req, res) => {
    const interval1ID = setInterval(elevatorCheck, 1000); 
    function stopElevatorCheck() {clearInterval(interval1ID);} 

    function elevatorCheck() {
        elevatorGetData().then(function(result) {
            const floor = req.params.floor;
            let elevator1FloorNr = result[0]; let elevator2FloorNr = result[1]; let elevator3FloorNr = result[2];
            let elevator1Status = result[3]; let elevator2Status = result[4]; let elevator3Status = result[5];
            let eCheck = ['', '', ''];

            if (elevator1Status == "Elevator is standing still") {eCheck[0] = [elevator1FloorNr];}
            else {eCheck[0] = [100];}
            if (elevator2Status == "Elevator is standing still") {eCheck[1] = [elevator2FloorNr];}
            else {eCheck[1] = [100];}
            if (elevator3Status == "Elevator is standing still") {eCheck[2] = [elevator3FloorNr];}
            else {eCheck[2] = [100];}

            let closest = eCheck.reduce(function(prev, curr) { return (Math.abs(curr - floor) < Math.abs(prev - floor) ? curr : prev); });
            const index = eCheck.findIndex((elev) => elev === closest);

            if (index+1 == 1 && elevator1Status == "Elevator is standing still") {elevator(11, floor, res); stopElevatorCheck();}
            else if (index+1 == 2 && elevator2Status == "Elevator is standing still") {elevator(12, floor, res); stopElevatorCheck();} 
            else if (index+1 == 3 && elevator3Status == "Elevator is standing still") {elevator(13, floor, res); stopElevatorCheck();} 
            
        });
    };
});

app.use(router);       
app.listen(process.env.PORT || 8080, () => {console.log(`Listening to port ${process.env.PORT}...`)});