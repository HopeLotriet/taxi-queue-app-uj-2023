import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';

const  db = await sqlite.open({
    filename:  './taxi_queue.db',
    driver:  sqlite3.Database
});

await db.migrate();

export async function joinQueue(passenger_queue_count) {
    // console.log('join queue')
const sql = `INSERT INTO taxi_queue (passenger_queue_count) VALUES (?)`
await db.run(sql, [passenger_queue_count])
}

await joinQueue()
// console.log(result1)

export async function leaveQueue(id) {
    const sql = `DELETE FROM taxi_queue WHERE id = ?`
await db.run(sql, [id])
}

await leaveQueue(100);

const result2 = await leaveQueue()
console.log(result2)

export async function joinTaxiQueue(taxi_queue_count) {
    const sql = `INSERT INTO taxi_queue (taxi_queue_count) VALUES (?)`
    
        await db.run(sql, [taxi_queue_count]);

}
await joinTaxiQueue()
// console.log(result3)

export async function queueLength() {
    const sql = `SELECT COUNT(*) as count FROM taxi_queue where passenger_queue_count IS NOT NULL`;
    const result = await db.get(sql);
    return result.count;
    
       
}

export async function taxiQueueLength() {
    const sql = `SELECT COUNT(*) AS count FROM taxi_queue WHERE taxi_queue_count IS NOT NULL`;
    const result = await db.get(sql);
    return result.count;

}

export async function taxiDepart() {

}

export async function updateTaxiQueue(passenger_queue_count, taxi_queue_count, id) {
const sql = `update taxi_queue set passenger_queue_count = ?, taxi_queue_count = ? where id = ?`;
await db.run(sql, [passenger_queue_count, taxi_queue_count, id])
}

await updateTaxiQueue (1, 1, 2)
await updateTaxiQueue (2, 3, 3)
await updateTaxiQueue (12, 4, 4)
await updateTaxiQueue (20, 1, 5)
const result4 = await updateTaxiQueue().then(res=>{
    // console.log(res)
})