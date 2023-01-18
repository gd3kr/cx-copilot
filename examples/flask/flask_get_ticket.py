from flask import Flask, jsonify
from cx_copilot import CXCopilot


cx = CXCopilot()

app = Flask(__name__)

@app.route('/get_ticket_response/<ticket_id>', methods=['GET'])
def get_ticket_response(ticket_id):
    cx_response = cx.get_ticket_response(ticket_id, cache_response=True, use_cached=True)
    response = {'ticket_id': ticket_id, 'response': cx_response}
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
