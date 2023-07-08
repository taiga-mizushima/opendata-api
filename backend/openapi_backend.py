# Flaskをインポートする
from flask import Flask, request, jsonify

# Flaskアプリケーションを作成する
app = Flask(__name__)

# 公共交通オープンデータセンターのAPIのベースURL
base_url = "https://api.odpt.org/api/v4/"

# アクセストークン（ユーザ登録後に発行される）
access_token = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# 乗降者数を取得する関数


def get_passenger_count(station_id):
    # APIのエンドポイント（乗降者数情報）
    endpoint = "odpt:PassengerSurvey"

    # リクエストのパラメータ（駅IDとアクセストークン）
    params = {
        "odpt:station": station_id,
        "acl:consumerKey": access_token
    }

    # リクエストを送信し、レスポンスを受け取る
    import requests
    response = requests.get(base_url + endpoint, params=params)

    # レスポンスが正常な場合
    if response.status_code == 200:
        # レスポンスのJSONデータを取得する
        data = response.json()

        # データが空でない場合
        if data:
            # 最新の乗降者数情報を取得する
            latest_data = data[0]

            # 駅名と乗降者数を返す
            station_name = latest_data["odpt:stationTitle"]["ja"]
            passenger_count = latest_data["odpt:passengerJourneys"]
            return station_name, passenger_count

        # データが空の場合
        else:
            # エラーメッセージを返す
            return "データがありません。"

    # レスポンスが正常でない場合
    else:
        # エラーメッセージを返す
        return "リクエストに失敗しました。"

# /passenger_countというURLでGETリクエストを受け付けるルートを定義する


@app.route("/passenger_count", methods=["GET"])
def passenger_count():
    # リクエストから駅IDを取得する
    station_id = request.args.get("station_id")

    # 駅IDが指定されている場合
    if station_id:
        # 駅IDを指定して、乗降者数を取得する
        result = get_passenger_count(station_id)

        # 結果がタプル（駅名と乗降者数）の場合
        if isinstance(result, tuple):
            # 結果をJSON形式で返す
            return jsonify({
                "station_name": result[0],
                "passenger_count": result[1]
            })

        # 結果が文字列（エラーメッセージ）の場合
        elif isinstance(result, str):
            # エラーメッセージをJSON形式で返す
            return jsonify({
                "error": result
            })

    # 駅IDが指定されていない場合
    else:
        # エラーメッセージをJSON形式で返す
        return jsonify({
            "error": "駅IDが指定されていません。"
        })


# Flaskアプリケーションを実行する（デバッグモードで）
if __name__ == "__main__":
    app.run(debug=True)
