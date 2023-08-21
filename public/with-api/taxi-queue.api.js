document.addEventListener('alpine:init', () => {

	Alpine.data('TaxiQueue', () => {

		return {
			version: 'api-1.0',
			queueLength: 0,

			addQueue: 0,
			removeQueue: 0,
			joinTaxi: 0,
			removeTaxi: 0,
			amountOfPeople: 12,
			taxiMessage: '',
			departTaxi: false,
			


			init() {
				axios
					.get('/api/passenger/queue')
					.then(result => {
						// an example API call
						this.queueLength = result.data.queueCount;
					});
			},
			joinQueue() {
				this.addQueue += 1
			},
			leaveQueue() {
				if (this.addQueue > 0) {
					this.addQueue -= 1
				}
			},

			joinTaxiQueue() {
				this.joinTaxi += 1

			},

			leaveTaxiQueue() {
				if (this.joinTaxi > 0 && this.amountOfPeople >= 12) {
					this.joinTaxi -= 1;
					this.amountOfPeople -= 12;

				}
			},

			queueLength() {
				return this.addQueue
			},

			taxiQueueLength() {
				return this.joinTaxi

			},


			taxiDepart() {
				if (this.amountOfPeople < 12 && this.joinTaxi < 0) {
					this.taxiMessage = 'The taxi may not depart, Not enough people!'
					setTimeout(() => {
						this.taxiMessage = '';
					}, 3000);
				}
				else if (this.amountOfPeople >= 12 && this.joinTaxi > 0) {
					this.taxiMessage = 'The taxi may depart!'
					setTimeout(() => {
						this.departTaxi = false;
						this.clearTaxi();
						this.amountOfPeople -= 12;
					}, 3000);
				}

			},

			clearTaxi() {
				this.addQueue = 0;
				this.removeQueue = 0;
				this.joinTaxi = 0;
				this.removeTaxi = 0;
				this.taxiMessage = '';


			}

		}
	});

});

