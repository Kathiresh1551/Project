from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

def get_db_connection():
    mypayanam = mysql.connector.connect (
        host= 'localhost', 
        user= 'root',
        password= 'Kathir@123',
        database = 'mypayanam'
    )
    return mypayanam

app = Flask(__name__)
CORS(app)



@app.route("/mypayanam")
def mypayanam():
    return {"trains": ["12244 CBE MAS SHATABDI", "12674 CHERAN EXPRESS", "12624 TVC CHENNAIMAIL", "06044 KCVL TBM SPECIAL", "MAS INTERCITY", "WEST COAST EXP", "KOVAI EXPRESS"]}

@app.route("/availableTrains")
def availableTrains():
    db = get_db_connection()
    mycursor = db.cursor(dictionary=True)
    mycursor.execute("select id, from_station, dest_station from train_table")
    trainDetails = mycursor.fetchall()
    return { "estatus": True, "emessage": "success", "data":  trainDetails}

@app.route("/bookedTickets", methods=["POST"])
def bookedTicketDetails():
    req = request.get_json()
    username = req['username']
    userEmail = req['userEmail']
    trainName = req['trainName']
    trainFrom = req['trainFrom']
    trainDest = req['trainDest']
    passengers = req['passengers']
    paidAmount = req['paidAmount']
    db = get_db_connection()
    mycursor = db.cursor(dictionary=True)
    query = f'insert into usertable (username, user_email, train_name, train_from_stat, train_dest_stat, passengers, paid_amount) values ("{username}", "{userEmail}", "{trainName}", "{trainFrom}", "{trainDest}", "{passengers}", {paidAmount});'
    mycursor.execute(query)
    db.commit()
    return {"estatus": True, "emessage": "success"}

@app.route("/betweenStations", methods=["POST"])
def betweenStations():
    req = request.get_json()
    fromStation = req['fromStation']
    destStation = req['destStation']
    day = req['day']
    db = get_db_connection()
    mycursor = db.cursor(dictionary=True)
    getTrainData = f'SELECT * FROM mypayanam.train_table INNER JOIN mypayanam.train_available_days ON train_table.id = train_available_days.train_id where from_station="{fromStation}" and dest_station="{destStation}" and available_day="{day}";'
    mycursor.execute(getTrainData)
    trainSchedule = mycursor.fetchall()
    if trainSchedule == []:
        return {"estatus": True, "emessage": "success", "data": "no train available"}
    return {"estatus": True, "emessage": "success", "data": trainSchedule}

@app.route("/signUp", methods=["POST"])
def signUp():
    req = request.get_json()
    email = req['email']
    name = req['name']
    role = req['role']
    password = req['password']
    mobileNumber = req['mobileNumber']
    query = f'insert into usertable (name, email, password, phone_number, role, amount) values ("{name}", "{email}", "{password}", "{mobileNumber}", "{role}", {1000});'
    db = get_db_connection()
    mycursor = db.cursor()
    mycursor.execute(query)
    db.commit()
    return {"estatus": True, "emessage": "success"}

@app.route("/signIn", methods=["POST"])
def signIn():
    req = request.get_json()
    email = req['email']
    password = req['password']
    db = get_db_connection()
    query = (f'select role, name, email from usertable where email="{email}" and password="{password}"')
    mycursor = db.cursor(dictionary=True)
    mycursor.execute(query)
    getUser = mycursor.fetchall()
    if len(getUser) > 0:
        return {"estatus": True, "emessage": "success", "data": getUser }
    else:
        return {"estatus": False, "emessage": "failure", "role": "-"}


@app.route("/addNewTrain", methods=["POST"])
def addNewTrain():
    req = request.get_json()
    trainName = req['trainName']
    destStation =  req['destStation']
    fromStation = req['fromStation']
    daysSelected = req['daysSelected']
    arrivalTime = req['arrivalTime']
    departureTime = req['departureTime']
    ticketRate = req['ticketRate']
    daysLenght = len(daysSelected)
    days = str(daysSelected)
    db = get_db_connection()
    mycursor = db.cursor()
    trainid = f'SELECT COUNT(*) FROM train_table;'
    mycursor.execute(trainid)
    myresult = mycursor.fetchone()
    lastTrainId = myresult[0] + 1 
    for day in daysSelected:
        mycursor.callproc('add_available_days', [lastTrainId, day])
    mycursor.callproc('get_train_details', [trainName, destStation, fromStation, days, arrivalTime, departureTime, daysLenght, lastTrainId, ticketRate])
    db.commit()
    return {"estatus": True, "emessage": "success"}


@app.route("/ticketInfo", methods=["POST"])
def ticketInfo():
    req = request.get_json()
    fromStation = req['fromStation']
    destStation = req['destStation']
    query = f'select general_comp_ticket_rate, ac_comp_ticket_rate from mypayanam.train_table where from_station="{fromStation}" and dest_station="{destStation}"' 
    db = get_db_connection()
    mycursor = db.cursor(dictionary=True)
    mycursor.execute(query)
    ticket = mycursor.fetchall()

    return {
        "estatus": True, "emessage": "success", "tickectInfo": ticket
    }



@app.route("/bookTickets", methods=["POST"])
def bookTickets():
    req = request.get_json()
    userName = req['userName']
    userEmail = req['userEmail']
    trainName = req['trainName']
    fromStation = req['fromStation']
    destStation = req['destStation']
    passengerName = req['passengerName']
    passengerAge = req['passengerAge']
    passengerCompartment = req['passengerCompartment']

    ticketRate = req['ticketRate']
    totalRate = req['totalRate']
    travelDate = req['travelDate']
    # for ticket in ticketRate:
    #     totalRate = totalRate + ticket
    
    db = get_db_connection()
    mycursor = db.cursor()
    for i in range (0, len(passengerCompartment)):
        mycursor.callproc('add_passengers', [passengerName[i], passengerAge[i], ticketRate[i]])
    mycursor.callproc('add_booked_tickets', [userName, userEmail, trainName, fromStation, destStation, travelDate, totalRate])
    db.commit()
    return {
        "estatus": True, "emessage": "success",
    }

@app.route("/requestTrains", methods=["POST"])
def requestTrains():
    req = request.get_json()
    username = req['username']
    fromStation = req['fromStation']
    destStation = req['destStation']
    arrivalTime = req['arrivalTime']
    departureTime = req['departureTime']
    db = get_db_connection()
    mycursor = db.cursor()
    mycursor.callproc('add_request_trains', [username, fromStation, destStation, arrivalTime, departureTime])
    db.commit()

    return {
        "estatus": True, "emessage": "success"
    }

@app.route("/requestedTrains") 
def requestedTrains():
    db = get_db_connection()
    mycursor = db.cursor(dictionary=True)
    mycursor.execute("SELECT * FROM mypayanam.requested_train_table;")
    requestedData = mycursor.fetchall()
    return { "estatus": True, "emessage": "success", "data":  requestedData}

@app.route("/myProfile", methods=["POST"])
def myProfile():
    req = request.get_json()
    userName = req['username']
    db = get_db_connection()
    mycursor = db.cursor(dictionary=True)
    query = f'select * from booked_tickets where username="{userName}"'
    mycursor.execute(query)
    data = mycursor.fetchall()
    return {
        "estatus": True, "emessage": "success", "data":  data
    }



if __name__ == '__main__':
    app.run()


