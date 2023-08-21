import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';

const  db = await sqlite.open({
    filename:  './taxi_queue.db',
    driver:  sqlite3.Database
});

await db.migrate();

export async function joinQueue() {
    // console.log('join queue')
    const sql = `UPDATE taxi_queue SET passenger_queue_count = passenger_queue_count + 1`;
    await db.run(sql);
}

// await joinQueue()
// console.log(result1)

export async function leaveQueue() {
    const sql = `UPDATE taxi_queue SET passenger_queue_count = max(0, passenger_queue_count - 1)`;
    await db.run(sql);
}

// await leaveQueue(100)
// await leaveQueue(100);
// await leaveQueue(100);
// await leaveQueue(100);
// await leaveQueue(100);
// await leaveQueue(100);
// await leaveQueue(100);
// await leaveQueue(100);

// const result2 = await leaveQueue()
// console.log(result2)

export async function joinTaxiQueue() {
    const sql = `UPDATE taxi_queue SET taxi_queue_count = taxi_queue_count + 1`;
    await db.run(sql);
}

// await joinTaxiQueue() 
// console.log(result3)

export async function queueLength() {
    const result = await db.get(`SELECT passenger_queue_count FROM taxi_queue`);
    return result.passenger_queue_count;
}

export async function taxiQueueLength() {
    const result = await db.get(`SELECT taxi_queue_count FROM taxi_queue`);
    return result.taxi_queue_count;
}

export async function taxiDepart() {

    const result = await db.get(`SELECT passenger_queue_count, taxi_queue_count FROM taxi_queue`);
    if (result.passenger_queue_count >= 12 && result.taxi_queue_count > 0) {
        await db.run(`UPDATE taxi_queue SET passenger_queue_count = passenger_queue_count - 12, taxi_queue_count = taxi_queue_count - 1`);
    }

}

// export async function updateTaxiQueue(passenger_queue_count, taxi_queue_count, id) {
// const sql = `UPDATE taxi_queue SET passenger_queue_count = ?, taxi_queue_count = ? WHERE id = ?`;
// await db.run(sql, [passenger_queue_count, taxi_queue_count, id])
// }

// await updateTaxiQueue (1, 1, 2)
// await updateTaxiQueue (2, 3, 3)
// await updateTaxiQueue (12, 4, 4)
// await updateTaxiQueue (20, 1, 5)
// const result4 = await updateTaxiQueue().then(res=>{
//     // console.log(res)
// })