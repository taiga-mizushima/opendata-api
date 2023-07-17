# Flaskモジュールをインポート
from flask import Flask, request, jsonify
from flask_cors import CORS
# requestsモジュールをインポート
import requests

# Flaskアプリケーションを作成
app = Flask(__name__)

# CORSを有効化
CORS(app)

# アクセストークン（実際のものと置き換える）
access_token = "949df92fb928d40507858f86a703e68f8cc76b3b93e42a7140abf4e0b20d0ebb"

# URLのベース部分
base_url = "https://api.odpt.org/api/v4"

# 駅情報を取得する関数
def get_station_data(lon, lat, radius):
    # URLにクエリパラメータを追加
    places = "places"
    url = f"{base_url}/{places}/odpt:Station?lon={lon}&lat={lat}&radius={radius}&acl:consumerKey={access_token}"

    # HTTP GETリクエストを送信
    response = requests.get(url)

    # JSONレスポンスを取得して返す
    return response.json()

# 乗降者数情報を取得する関数
def get_passenger_data(passenger_surveys):
    # 乗降者数情報のリストを作成
    passenger_data = []
    for passenger_survey in passenger_surveys:
        # URLにクエリパラメータを追加
        url = f"{base_url}/odpt:PassengerSurvey?acl:consumerKey={access_token}&owl:sameAs={passenger_survey}"

        # HTTP GETリクエストを送信
        response = requests.get(url)

        # JSONレスポンスを取得して追加
        passenger_data.append(response.json()[0])

    # 乗降者数情報のリストを返す
    return passenger_data

# 最新のsurveyYearに該当するデータだけを抽出する関数
def filter_latest_data(passenger_data):
    # 最新のsurveyYearを取得する（odpt:passengerSurveyObjectの中から）
    latest_year = max(data["odpt:surveyYear"] for data in passenger_data for data in data["odpt:passengerSurveyObject"])

    # 最新のsurveyYearに該当するデータだけを抽出する（odpt:passengerSurveyObjectの中から）
    latest_data = [data for data in passenger_data for data in data["odpt:passengerSurveyObject"] if data["odpt:surveyYear"] == latest_year]

    # 抽出したデータを返す
    return latest_data

# /passengerというエンドポイントを定義
@app.route("/passenger")
def get_passenger():
    # クエリパラメータから経度と緯度と範囲を取得
    lon = request.args.get("lon")
    lat = request.args.get("lat")
    radius = request.args.get("radius")

    # 駅情報を取得する
    station_data = get_station_data(lon, lat, radius)

    # 駅情報からodpt:PassengerSurveyのリストを作成
    passenger_surveys = []
    for station in station_data:
        passenger_surveys.extend(station["odpt:passengerSurvey"])

    # 乗降者数情報を取得する
    passenger_data = get_passenger_data(passenger_surveys)

    # 最新のsurveyYearに該当するデータだけを抽出する
    latest_data = filter_latest_data(passenger_data)

    # 抽出したデータから、passengerJourneysを取り出して合計する（odpt:passengerSurveyObjectの中から）
    total_passengers = sum(data["odpt:passengerJourneys"] for data in latest_data)

    # JSONレスポンスを返却
    return jsonify({"total_passengers": total_passengers})

# Flaskアプリケーションを実行
if __name__ == "__main__":
    app.run()
