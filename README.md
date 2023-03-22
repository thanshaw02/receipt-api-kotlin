# Receipt API

This is another re-write of a small project I did previously, I'm building an API using the `Vert.x` frameform and `Kotlin`.

The frontend is built using `TypeScript` and `Angular` -- this is my first time touching `Angular` in a year, my previoujs experience was strictly with `Angular.js`. This time around I am using `Angular 2` instead.

# How to start the backend

**Note:** To run the backend via the command line you will need the `Maven CLI` installed globally

1. After pulling down this repository _cd_ into `receipt-api-kotin/backend`

2. From your command line run `mvn exec:java`
    - I personally do all of my work using Ubuntu WSL 2 (Windows Subsystem for Linux)
    - For help installing _WSL_, the _Maven CLI_, the _Angular CLI_, or _npm_ see the helpful links section towards the end of the README

3. Verify you text printed to the commnad line, the last statement printed should say _HTTP server started on port 8000_

4. The HTTP server should be running now, to test it without using the frontend you can use `curl`, below are two `curl` commands that may be used to test the backend

# How to start the frontend

**Note:** To run the frontend via the command line you will need the `Angular CLI` installed globally

1. After pulling down this repository _cd_ into `receipt-api-kotin/frontend`

2. From your command line (I am using WSL) run `ng serve --open`
    - What this command does is it starts the frontend server and opens the frontend up in your default browser (the --open flag does this)

3. Verify there are no errors printed in the command line and the receipt form is displayed in your browser

# How to test the Receipt API

## Using curl

1. From your console run this `curl` command to hit the `/receipts/process` POST endpoint:
    - This command specifically holds the same _Receipt_ data used in _example one_ of the assignment
    - **Note:** This command uses the _verbose_ option so you can see everything sent back

> curl -v -d '{"retailer": "Target", "purchaseDate": "2022-01-01", "purchaseTime": "13:01", "items": [{"shortDescription": "Mountain Dew 12PK", "price": "6.49"}, {"shortDescription": "Emils Cheese Pizza", "price": "12.25"}, {"shortDescription": "Knorr Creamy Chicken", "price": "1.26"}, {"shortDescription": "Doritos Nacho Cheese", "price": "3.35"}, {"shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ", "price": "12.00"}], "total": "35.35"}' -X POST 'http://localhost:8000/receipts/process'


2. Verify you are sent back a JSON object that follows this format below:

> { "id" : "1c23395b-7b6e-47bf-887c-f8e7608c809c" }

3. Copy the _UUID_, this will be used to hit the `/receipts/{id}/points` GET endpoint

4. From the console run this `curl` command to hit the `/receipts/{id}/points` endpoint using the _UUID_ received from the previous POST request:
    - **Note:** The _uuid_ between _receipts_ and _points_ in this path must be the id from earlier

> curl -v -X GET 'http://localhost:8000/receipts/1c23395b-7b6e-47bf-887c-f8e7608c809c/points'

5. Verify you are sent back a JSON object that follows this format below:

> { "points" : "28" }

6. In this case `28` should be the correct amount of points that the receipt sent earlier has

### Further testing

I will include another POST curl command that represents _example two_ from the assignment, this receipt should accrue `109` points -- so verify this is what you see after sending your GET request.

> curl -v -d '{"retailer": "M&M Corner Market", "purchaseDate": "2022-03-20", "purchaseTime": "14:33", "items": [{"shortDescription": "Gatorade", "price": "2.25"}, {"shortDescription": "Gatorade", "price": "2.25"}, {"shortDescription": "Gatorade", "price": "2.25"}, {"shortDescription": "Gatorade", "price": "2.25"}], "total": "9.00"}' -X POST 'http://127.0.0.1:8000/receipts/process'

Use the same GET `curl` command from the above section using the new id -- verify that `109` points are returned.

You may do further testing my creating your own receipt objects, counting the points that receipt object should accrue, then sending that object to the POST endpoint and fetching the accruied points via the GET endpoint. If you run into any issues please feel free to make a comment in this repository or you can reach me by email add tylorjhanshaw@gmail.com.

## Using the frontend

1. After running the backend and starting the frontend fill out the fields to create a `Receipt` object
    - You will see error messages if a field is missing both in the main form and in the _add receipt items_ section

2. Verify that the _total_ field towards the bottom is correct based off of the items entered above

3. Click the `Submit Receipt` button to POST the receipt object to the backend
    - You will see a success message towards the top of the form if the POST request was successful

4. Once you submit the `Receipt` object a success notification will display towards the top of the screen and a `Material UI Bottom Sheet` will pop up towards the bottom of your screen
    - This bottom sheet will display the accrued points for the receipt you previously submitted

**Note:**
- You may submit as many receipt objects as you like, just make sure that the points accrued add up to the actual poinst accrued for the receipt
- When adding new receipt items, if you have a **typo** you can edit the added receipt item by clicking on the _edit/pencil_ icon button that is to the right of each added receipt item. Simply click on the edit button to enable the input fields, make your edits, then click the edit button again to disable the fields.
    - Verify that if any _price_ changes were made to a receipt item that the _total_ field towards the bottom of the form was updated correctly.

# Helpful Links/Rules

- [Installing the _Maven CLI_ using Ubuntu WSL 2 (Windows Subsystem for Linux)](https://www.digitalocean.com/community/tutorials/install-maven-linux-ubuntu)

- [Installing the _Angular CLI_](https://angular.io/cli) (You will need to have `npm` installed as well)

- [This link walks you through the steps to install _npm_ (Node Package Manager) for Ubuntu WSL 2 (Windows Subsystem for Linux)](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl)

- [This link includes the rules around how points are accrued for a given _Receipt_ object](https://github.com/fetch-rewards/receipt-processor-challenge#rules)
