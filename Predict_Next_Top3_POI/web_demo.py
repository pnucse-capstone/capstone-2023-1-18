"""
    FMM web application
    Author: Can Yang
"""

import os
import tornado.wsgi
import tornado.httpserver
import time
import optparse
import logging
import flask
from flask import jsonify, request
from mapmatcher import MapMatcher
import numpy as np
from pymongo import MongoClient
from bson import json_util
import pandas as pd
from hmmlearn.hmm import CategoricalHMM
import json


app = flask.Flask(__name__, static_url_path="/static")
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0


@app.route("/")
def index():
    return flask.render_template("demo.html")


@app.route("/demo")
def demo():
    return flask.render_template("demo.html")


# @app.route('/static/<path:path>')
# def send_js(path):
# return send_from_directory('static', path)


@app.route("/match_wkt", methods=["GET"])
def match_url():
    # print(flask.request.args)
    wkt = str(flask.request.args.get("wkt", ""))
    # logging.info('WKT get in python: %s', wkt)
    starttime = time.time()
    result = app.mapmatcher.match_wkt(wkt)
    mgeom_wkt = ""
    if result.mgeom.get_num_points() > 0:
        mgeom_wkt = result.mgeom.export_wkt()
    # logging.info('Probs %s',probs)
    endtime = time.time()
    # logging.info('%s', result)
    # logging.info('Time cost: %s', result[2])
    # print "Result is ",result
    # print "Result geom is ",result.mgeom
    if mgeom_wkt != "":
        # print "Matched"
        response_json = {"wkt": mgeom_wkt, "state": 1}
        return jsonify(response_json)
    else:
        # print "Not matched"
        return jsonify({"state": 0})


def start_tornado(app, port=5001):
    http_server = tornado.httpserver.HTTPServer(tornado.wsgi.WSGIContainer(app))
    http_server.listen(port)
    print("Tornado server starting on port {}".format(port))
    print("Visit http://localhost:{} to check the demo".format(port))
    tornado.ioloop.IOLoop.instance().start()


def start_from_terminal(app):
    """
    Parse command line options and start the server.
    """
    parser = optparse.OptionParser()
    # Store the file argument into the filename attr
    # parser.add_option("-f", "--file", action="store", type="string", dest="filename")
    parser.add_option(
        "-d", "--debug", help="enable debug mode", action="store_true", default=False
    )
    parser.add_option(
        "-p",
        "--port",
        help="which port to serve content on",
        action="store",
        dest="port",
        type="int",
        default=5001,
    )
    parser.add_option(
        "-c",
        "--config",
        help="the model configuration file",
        action="store",
        dest="config_file",
        type="string",
        default="config.json",
    )
    opts, args = parser.parse_args()
    app.mapmatcher = MapMatcher(opts.config_file)
    if opts.debug:
        app.run(debug=True, host="0.0.0.0", port=opts.port)
    else:
        start_tornado(app, opts.port)


client = MongoClient("mongodb://won:0957@localhost:27017/")


@app.route("/get_Attraction", methods=["GET"])
def get_Attraction():
    # MongoDB에서 데이터를 가져옵니다.
    db = client["POI_BASED_DATA"]  # 여기서 "mydatabase"는 사용하는 데이터베이스 이름입니다.
    collection = db["ATTRACTION"]  # "mycollection"은 컬렉션 이름입니다.
    data = list(collection.find({}, {"_id": 0}))
    # JSON 형식으로 데이터를 반환합니다.
    return jsonify(data)


@app.route("/get_Restaurant", methods=["GET"])
def get_Restaurant():
    # MongoDB에서 데이터를 가져옵니다.
    db = client["POI_BASED_DATA"]  # 여기서 "mydatabase"는 사용하는 데이터베이스 이름입니다.
    collection = db["RESTAURANT"]  # "mycollection"은 컬렉션 이름입니다.
    data = list(collection.find({}, {"_id": 0}))
    # JSON 형식으로 데이터를 반환합니다.
    return jsonify(data)


@app.route("/get_Total_Traj", methods=["GET"])
def get_Total_Traj():
    # MongoDB에서 데이터를 가져옵니다.
    db = client["Trajectory"]  # 여기서 "mydatabase"는 사용하는 데이터베이스 이름입니다.
    collection = db["Total_Traj"]  # "mycollection"은 컬렉션 이름입니다.

    data = list(collection.find({}, {"_id": 0}))
    # JSON 형식으로 데이터를 반환합니다.
    return jsonify(data)


@app.route("/get_Spring_Traj", methods=["GET"])
def get_Spring_Traj():
    # MongoDB에서 데이터를 가져옵니다.
    db = client["Trajectory"]  # 여기서 "mydatabase"는 사용하는 데이터베이스 이름입니다.
    collection = db["Spring_Traj"]  # "mycollection"은 컬렉션 이름입니다.
    data = list(collection.find({}, {"_id": 0}))
    # JSON 형식으로 데이터를 반환합니다.
    return jsonify(data)


@app.route("/get_Summer_Traj", methods=["GET"])
def get_Summer_Traj():
    # MongoDB에서 데이터를 가져옵니다.
    db = client["Trajectory"]  # 여기서 "mydatabase"는 사용하는 데이터베이스 이름입니다.
    collection = db["Summer_Traj"]  # "mycollection"은 컬렉션 이름입니다.
    data = list(collection.find({}, {"_id": 0}))
    # JSON 형식으로 데이터를 반환합니다.
    return jsonify(data)


@app.route("/get_Fall_Traj", methods=["GET"])
def get_Fall_Traj():
    # MongoDB에서 데이터를 가져옵니다.
    db = client["Trajectory"]  # 여기서 "mydatabase"는 사용하는 데이터베이스 이름입니다.
    collection = db["Fall_Traj"]  # "mycollection"은 컬렉션 이름입니다.
    data = list(collection.find({}, {"_id": 0}))
    # JSON 형식으로 데이터를 반환합니다.
    return jsonify(data)


@app.route("/get_Winter_Traj", methods=["GET"])
def get_Winter_Traj():
    # MongoDB에서 데이터를 가져옵니다.
    db = client["Trajectory"]  # 여기서 "mydatabase"는 사용하는 데이터베이스 이름입니다.
    collection = db["Winter_Traj"]  # "mycollection"은 컬렉션 이름입니다.
    data = list(collection.find({}, {"_id": 0}))
    # JSON 형식으로 데이터를 반환합니다.
    return jsonify(data)


@app.route("/get_Spring_HMM", methods=["GET"])
def get_Spring_HMM():
    # MongoDB에서 데이터를 가져옵니다.
    db = client["HMM"]  # 여기서 "mydatabase"는 사용하는 데이터베이스 이름입니다.
    collection = db["Spring_HMM"]  # "mycollection"은 컬렉션 이름입니다.
    data = list(collection.find({}, {"_id": 0}))
    # JSON 형식으로 데이터를 반환합니다.
    return jsonify(data)


@app.route("/get_Summer_HMM", methods=["GET"])
def get_Summer_HMM():
    # MongoDB에서 데이터를 가져옵니다.
    db = client["HMM"]  # 여기서 "mydatabase"는 사용하는 데이터베이스 이름입니다.
    collection = db["Summer_HMM"]  # "mycollection"은 컬렉션 이름입니다.
    data = list(collection.find({}, {"_id": 0}))
    # JSON 형식으로 데이터를 반환합니다.
    return jsonify(data)


@app.route("/get_Fall_HMM", methods=["GET"])
def get_Fall_HMM():
    # MongoDB에서 데이터를 가져옵니다.
    db = client["HMM"]  # 여기서 "mydatabase"는 사용하는 데이터베이스 이름입니다.
    collection = db["Fall_HMM"]  # "mycollection"은 컬렉션 이름입니다.
    data = list(collection.find({}, {"_id": 0}))
    # JSON 형식으로 데이터를 반환합니다.
    return jsonify(data)


@app.route("/get_Winter_HMM", methods=["GET"])
def get_Winter_HMM():
    # MongoDB에서 데이터를 가져옵니다.
    db = client["HMM"]  # 여기서 "mydatabase"는 사용하는 데이터베이스 이름입니다.
    collection = db["Winter_HMM"]  # "mycollection"은 컬렉션 이름입니다.
    data = list(collection.find({}, {"_id": 0}))
    # JSON 형식으로 데이터를 반환합니다.
    return jsonify(data)


@app.route("/get_Total_POI", methods=["GET"])
def get_Total_POI():
    # MongoDB에서 데이터를 가져옵니다.
    db = client["POI"]  # 여기서 "mydatabase"는 사용하는 데이터베이스 이름입니다.
    collection = db["Total"]  # "mycollection"은 컬렉션 이름입니다.
    data = list(collection.find({}, {"_id": 0}))
    # JSON 형식으로 데이터를 반환합니다.
    return jsonify(data)


@app.route("/get_Spring_POI", methods=["GET"])
def get_Spring_POI():
    # MongoDB에서 데이터를 가져옵니다.
    db = client["POI"]  # 여기서 "mydatabase"는 사용하는 데이터베이스 이름입니다.
    collection = db["Spring"]  # "mycollection"은 컬렉션 이름입니다.
    data = list(collection.find({}, {"_id": 0}))
    # JSON 형식으로 데이터를 반환합니다.
    return jsonify(data)


@app.route("/get_Summer_POI", methods=["GET"])
def get_Summer_POI():
    # MongoDB에서 데이터를 가져옵니다.
    db = client["POI"]  # 여기서 "mydatabase"는 사용하는 데이터베이스 이름입니다.
    collection = db["Summer"]  # "mycollection"은 컬렉션 이름입니다.
    data = list(collection.find({}, {"_id": 0}))
    # JSON 형식으로 데이터를 반환합니다.
    return jsonify(data)


@app.route("/get_Fall_POI", methods=["GET"])
def get_Fall_POI():
    # MongoDB에서 데이터를 가져옵니다.
    db = client["POI"]  # 여기서 "mydatabase"는 사용하는 데이터베이스 이름입니다.
    collection = db["Fall"]  # "mycollection"은 컬렉션 이름입니다.
    data = list(collection.find({}, {"_id": 0}))
    # JSON 형식으로 데이터를 반환합니다.
    return jsonify(data)


@app.route("/get_Winter_POI", methods=["GET"])
def get_Winter_POI():
    # MongoDB에서 데이터를 가져옵니다.
    db = client["POI"]  # 여기서 "mydatabase"는 사용하는 데이터베이스 이름입니다.
    collection = db["Winter"]  # "mycollection"은 컬렉션 이름입니다.
    data = list(collection.find({}, {"_id": 0}))
    # JSON 형식으로 데이터를 반환합니다.
    return jsonify(data)


###################################
#               HMM               #
###################################

from sklearn.metrics import accuracy_score


def get_next_POI(hmm_model, user_trajectory):
    X = np.array(user_trajectory["l_sequence"][0])

    can_sequences = [np.append(X, i) for i in range(100)]

    decodes = [hmm_model.decode(seq.reshape(-1,1)) for seq in can_sequences]

    sorted_decode = sorted(decodes, key=lambda x:x[0])[::-1]

    # 순서대로 1, 2, 3
    unique_top_3_indices = []
    for log_likelihood, hidden_state_seq in sorted_decode:
        recommendation_POI = hidden_state_seq[-1]
        if recommendation_POI not in unique_top_3_indices:
            unique_top_3_indices.append(recommendation_POI)
        
        if len(unique_top_3_indices) == 3:
            break
    return unique_top_3_indices


@app.route("/process_data", methods=["POST"])
def process_data():
    db = client["HMM"]  # 여기서 "mydatabase"는 사용하는 데이터베이스 이름입니다.
    collection = db["Total_HMM"]  # "mycollection"은 컬렉션 이름입니다.
    hmm_data = list(collection.find({}, {"_id": 0}))
    hmm_df = pd.DataFrame(hmm_data)

    data = request.get_json()
    input_traj = data["input_traj"]
    df = pd.DataFrame(input_traj)

    # 로깅

    hmm_model = CategoricalHMM(n_components=25, n_features=100)
    hmm_model.startprob_ = hmm_df["model_params"][0]["startprob"]
    hmm_model.transmat_ = hmm_df["model_params"][0]["transmat"]
    hmm_model.emissionprob_ = hmm_df["model_params"][0]["emissionprob"]

    app.logger.info(get_next_POI(hmm_model, df))
    next_POI_idx = get_next_POI(hmm_model, df)
    result = f"POI{next_POI_idx[0]} POI{next_POI_idx[1]} POI{next_POI_idx[2]}"

    return jsonify({"result": result})


@app.route("/process_db_data", methods=["POST"])
def process_db_data():
    db = client["HMM"]  # 여기서 "mydatabase"는 사용하는 데이터베이스 이름입니다.
    collection = db["Total_HMM"]  # "mycollection"은 컬렉션 이름입니다.
    hmm_data = list(collection.find({}, {"_id": 0}))
    hmm_df = pd.DataFrame(hmm_data)

    data = request.get_json()
    new_db_traj_array = data["new_db_traj_array"]
    app.logger.info(new_db_traj_array)
    df = pd.DataFrame(new_db_traj_array)
    # 로깅

    hmm_model = CategoricalHMM(n_components=25, n_features=100)
    hmm_model.startprob_ = hmm_df["model_params"][0]["startprob"]
    hmm_model.transmat_ = hmm_df["model_params"][0]["transmat"]
    hmm_model.emissionprob_ = hmm_df["model_params"][0]["emissionprob"]

    app.logger.info(get_next_POI(hmm_model, df))
    next_POI_idx = get_next_POI(hmm_model, df)
    result = f"POI{next_POI_idx[0]} POI{next_POI_idx[1]} POI{next_POI_idx[2]}"

    return jsonify({"result": result})


if __name__ == "__main__":
    logging.getLogger().setLevel(logging.INFO)
    start_from_terminal(app)
