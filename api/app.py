from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

def connect_db():
    return mysql.connector.connect(
        host="db",
        user="root",
        password="HolaQuet4l?1234",
        database="taller"
    )


@app.route('/vehicles', methods=['GET'])
def get_vehicles():
    db = connect_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM vehicles")
    vehicles = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(vehicles)


@app.route('/appointments', methods=['GET'])
def get_appointments():
    db = connect_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            cites.id,
            cites.vehicle_id,
            vehicles.matricula,
            vehicles.model,
            cites.data_cita,
            cites.servei_sollicitat
        FROM cites
        INNER JOIN vehicles ON cites.vehicle_id = vehicles.id
        ORDER BY cites.data_cita ASC
    """)

    appointments = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(appointments)


@app.route('/appointments', methods=['POST'])
def create_appointment():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No s’han rebut dades'}), 400

    required_fields = ['vehicle_id', 'data_cita', 'servei_sollicitat']

    for field in required_fields:
        if field not in data or data[field] == '':
            return jsonify({'error': f'Falta el camp: {field}'}), 400

    db = connect_db()
    cursor = db.cursor()

    cursor.execute(
        """
        INSERT INTO cites (vehicle_id, data_cita, servei_sollicitat)
        VALUES (%s, %s, %s)
        """,
        (data['vehicle_id'], data['data_cita'], data['servei_sollicitat'])
    )

    db.commit()

    cursor.close()
    db.close()

    return jsonify({'message': 'Cita creada correctament'}), 201


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)