
import assert from 'assert';
import {joinQueue, queueLength, 
		leaveQueue, joinTaxiQueue, 
		taxiQueueLength, taxiDepart} from '../taxi.sql.js'

import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';

const  db = await sqlite.open({
    filename:  './taxi_queue.db',
    driver:  sqlite3.Database
});

await db.migrate();

describe('The taxi queue app', function() {

	this.beforeEach(async () => {
		//
		await db.exec(`update taxi_queue set passenger_queue_count = 0, taxi_queue_count = 0`)
	})

	it ('should allow people to join the queue', async function() {

		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();

		assert.equal(5, await queueLength());

	});

	it ('should allow people to leave the queue', async function() {

		await joinQueue();
		await joinQueue();
		await leaveQueue();
		await leaveQueue();
		await joinQueue();

		assert.equal(1, await queueLength());

	});

	it ('should not allow the people queue to be less than 0', async function() {

		await joinQueue();
		await joinQueue();
		await joinQueue();

		await leaveQueue();
		await leaveQueue();
		await leaveQueue();
		await leaveQueue();
		await leaveQueue();

		assert.equal(0, await queueLength());

	});

	it ('should allow taxis to join the queue', async function() {
		
		await joinTaxiQueue();
		await joinTaxiQueue();
		await joinTaxiQueue();

		assert.equal(3, await taxiQueueLength());

	});

	it ('should allow taxis to leave the queue if there is enough passengers queueing', async function() {

		await joinQueue(); // 1
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue(); // 12
		await joinQueue(); 
		await joinQueue();
		await joinQueue(); 

		await joinTaxiQueue();
		await joinTaxiQueue();
		await joinTaxiQueue();

		// data before a taxi departs
		assert.equal(3, await taxiQueueLength());
		assert.equal(15, await queueLength());

		await taxiDepart();

		// data after a taxi departed
		assert.equal(2, await taxiQueueLength());
		assert.equal(3, await queueLength());
		// assert.equal(2, taxiQueue.queueLength());

	});

	it ('should not allow a taxi to leave the queue if there is not enough passengers queueing', async function() {

		await joinQueue(); // 1
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();   
		await joinQueue(); // 11 

		await joinTaxiQueue();
		await joinTaxiQueue();
		await joinTaxiQueue();

		// data before a taxi departs
		assert.equal(3, await taxiQueueLength());
		assert.equal(11, await queueLength());

		// this function call should do nothing as there is not enough passengers in the queue
		taxiDepart();

		// data after a taxi departed
		assert.equal(3, taxiQueueLength());
		assert.equal(11, queueLength());

	});

	it ('should check that a taxi can not leave if the taxi queue is empty', async function() {

		await joinQueue(); // 1
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue();
		await joinQueue(); // 12
		await joinQueue(); 
		await joinQueue();
		await joinQueue(); 

		// data before a taxi departs
		assert.equal(0, await taxiQueueLength());
		assert.equal(15, await queueLength());

		// this function call should do nothing as there is no taxis in the taxi queue
		taxiDepart();
		
		// data after a taxi departed
		assert.equal(0,await queueLength());
		assert.equal(15, await queueLength());

	});
});