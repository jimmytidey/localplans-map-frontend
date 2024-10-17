from flask import Flask, json, send_file, request, make_response, send_from_directory
import os
import json
from flask_cors import CORS, cross_origin
from compare_lpas import compare_lpas
from multiagent import multi_agent, follow_on
app = Flask(__name__)

CORS(app, resources={r"/compare/": {"origins": "*"}})
CORS(app, resources={r"/multi-agent/": {"origins": "*"}})
CORS(app, resources={r"/multi-agent-follow-on/": {"origins": "*"}})


@app.route('/compare/', methods=['GET'])
def compare():
    topic = request.args.get('topic')
    lpa1 = request.args.get('lpa1')
    lpa2 = request.args.get('lpa2')
    response = compare_lpas(topic, lpa1, lpa2)

    return response


@app.route('/multi-agent/', methods=['GET'])
def multi_agent_start():
    topic = request.args.get('topic')
    agent_a_personality = request.args.get('agent_a_personality')
    agent_b_personality = request.args.get('agent_b_personality')
    lpa = request.args.get('lpa')
    response = json.dumps(multi_agent(
        topic, agent_a_personality, agent_b_personality, lpa))

    return response


@app.route('/multi-agent-follow-on/', methods=['GET'])
def multi_agent_route():
    context = request.args.get('context')
    previous_statement = request.args.get('previous_statement')
    agent_personality = request.args.get('agent_personality')
    response = json.dumps(
        follow_on(context, previous_statement, agent_personality))
    return response


@app.route('/',  methods=['GET'])
def serve_app():
    return send_from_directory('app', 'index.html')


@app.route('/assets/<path:path>',  methods=['GET'])
def serve_app_assets(path):
    return send_from_directory('app/assets', path)


@app.errorhandler(404)
def not_found(e):
    return send_from_directory('app', 'index.html')


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
