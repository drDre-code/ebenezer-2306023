# Quick start

1. Change to the root directory of the project.
2. Run `npm install`. This should install all the needed packages.
3. Run `npm run build`. This should install compile the code into js.
4. Copy `.env.example` to `.env` and fill in your credentials.
5. You need a mysql database.
6. Now run `npm run start`. This should launch this services and start processing data in one minute has set by the cronJob.

# Assumptions
It is assumed that upon calling the endpoint without any additional queries gets the data from this exact minute. 
So a cronJob handles calling the endpoint every minute and processing the data