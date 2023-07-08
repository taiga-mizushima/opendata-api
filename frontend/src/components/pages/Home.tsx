import React, { useState, useEffect } from "react";
import axios from "axios";

import { memo, FC } from "react";
import { Header } from "../organisms/Header";
import { MainTemplate } from "../templates/MainTemplate";
import { Result } from "../organisms/Result";
import { Footer } from "../organisms/Footer";
import { Map } from "../organisms/Map";

export const PassengersPage: FC = memo(() => {
    // ステートを定義
    const [stations, setStations] = useState([]); // 駅のリスト
    const [passengers, setPassengers] = useState(null); // 乗降者数
    const [error, setError] = useState(null); // エラー

    // APIのURL
    const url = "http://localhost:5000/passengers";

    // コンポーネントがマウントされたときの処理
    useEffect(() => {
        // 駅のリストを取得する関数
        const fetchStations = async () => {
            try {
                // 公共交通オープンデータAPIに送信するパラメータを設定
                const params = {
                    "acl:consumerKey": token, // アクセストークン
                    "odpt:operator": "odpt.Operator:JR-East", // 運営会社（ここではJR東日本）
                };
                // 公共交通オープンデータAPIにリクエストを送信し、レスポンスを取得
                const response = await axios.get(
                    "https://api-tokyochallenge.odpt.org/api/v4/odpt:Station",
                    { params: params }
                );
                // レスポンスから駅のリストを取得し、ステートにセット
                setStations(response.data);
                // エラーがあればクリア
                setError(null);
            } catch (err) {
                // エラーが発生した場合は、エラーメッセージをステートにセット
                setError(err.response.data.error);
                // 駅のリストがあればクリア
                setStations([]);
            }
        };
        // 駅のリストを取得する関数を呼び出す
        fetchStations();
    }, []);

    // 駅のマーカーのクリックをハンドルする関数
    const handleClick = (station) => {
        // APIにリクエストを送信する関数
        const fetchPassengers = async () => {
            try {
                // パラメータを設定
                const params = {
                    operator: station["odpt:operator"],
                    station: station["owl:sameAs"],
                };
                // APIにリクエストを送信し、レスポンスを取得
                const response = await axios.get(url, { params: params });
                // レスポンスから乗降者数を取得し、ステートにセット
                setPassengers(response.data.passengers);
                // エラーがあればクリア
                setError(null);
            } catch (err) {
                // エラーが発生した場合は、エラーメッセージをステートにセット
                setError(err.response.data.error);
                // 乗降者数があればクリア
                setPassengers(null);
            }
        };
        // APIにリクエストを送信する関数を呼び出す
        fetchPassengers();
    };

    return (
        <div className="container">
            <Header />
            <MainTemplate>
                <Map stations={stations} handleClick={handleClick} />
                <Result passengers={passengers} error={error} />
            </MainTemplate>
            <Footer />
        </div>
    );
});
