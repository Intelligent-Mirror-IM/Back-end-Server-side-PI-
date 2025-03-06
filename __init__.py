from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to the Smart Mirror API!"

@app.route('/motion-detection', methods=['GET'])
def motion_detection():
    # Here you can add your logic for AI-based motion recognition
    return jsonify({"status": "Motion detected", "action": "Show prompt"})

if __name__ == '__main__':
    app.run(debug=True)
