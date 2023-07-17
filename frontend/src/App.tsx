// React, axios, React-Leafletをインポート
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";

// styles.cssをインポート
import "./styles.css";
import 'leaflet/dist/leaflet.css';

// 乗降者数の合計を表示するコンポーネント
const PassengerTotal: React.FC<{ lon: string; lat: string }> = ({ lon, lat }) => {
  // 乗降者数の合計をステートとして定義
  const [total, setTotal] = useState<number | null>(null);

  // エラーメッセージをステートとして定義（デフォルトは空文字）
  const [error, setError] = useState("");

  // コンポーネントがマウントされたときにAPIを呼び出す
  useEffect(() => {
    // 経度と緯度が空文字でなければAPIを呼び出す
    if (lon !== "" && lat !== "") {
      // APIのURL
      const url = `http://localhost:5000/passenger?lon=${lon}&lat=${lat}&radius=50`;

      // HTTP GETリクエストを送信
      axios.get(url).then((response) => {
        // JSONレスポンスから乗降者数の合計を取得
        const total_passengers = response.data.total_passengers;

        // ステートを更新
        setTotal(total_passengers);
        setError(""); // エラーメッセージを空にする
      })
      .catch((error) => {
        // エラーが発生した場合は、文言を表示
        setError("クリックした場所が正しくありません。別の場所をクリックしてください。");
      });
    }
  }, [lon, lat]); // 経度と緯度が変わったら再実行

  // エラーメッセージがあればそれを表示
  if (error !== "") {
    return <div>{error}</div>;
  }

  // 乗降者数の合計がnullならローディング中と表示
  if (total === null) {
    return <div>ローディング中...</div>;
  }

  // 乗降者数の合計を表示
  return <div>乗降者数の合計は{total}人です。</div>;
};

// 地図を表示するコンポーネント
const MapView: React.FC<{ setLon: (lon: string) => void; setLat: (lat: string) => void }> = ({
  setLon,
  setLat,
}) => {
  // 地図上のクリックイベントを取得するカスタムフック
  const MapEvents = () => {
    const map = useMapEvents({
      click(e) {
        // クリックした位置の緯度と経度を取得
        const { lat, lng } = e.latlng;
        console.log(lat, lng); // 緯度と経度を確認
        setLon(lng.toString()); // PassengerTotalコンポーネントのプロパティを更新
        setLat(lat.toString()); // PassengerTotalコンポーネントのプロパティを更新
      },
    });
    return null;
  };

  // 地図を表示
  return (
    <MapContainer center={[35.681236, 139.767125]} zoom={13} style={{ height: "600px", width: "800px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapEvents />
    </MapContainer>
  );
};

// アプリケーションを作成
const App: React.FC = () => {
  // 経度と緯度をステートとして定義（デフォルトは空文字）
  const [lon, setLon] = useState("");
  const [lat, setLat] = useState("");

  return (
    <div className="container">
      {/* ヘッダー */}
      <header>
        <h1>公共交通オープンデータAPIを呼び出すReactアプリ</h1>
      </header>

      {/* メイン */}
      <main>
        {/* 説明 */}
        <div className="description">
          <p>
            地図上の任意の位置から半径50m以内の公共交通機関の乗降者数の合計を表示します。</p>
            <p>地図をクリックして、乗降者数を確認してみてください。</p>
        </div>

        {/* 地図 */}
        <div className="map">
          <MapView setLon={setLon} setLat={setLat} />
        </div>

        {/* 乗降者数 */}
        <div className="passenger">
          <PassengerTotal lon={lon} lat={lat} />
        </div>
      </main>

      {/* フッター */}
      <footer>
        <p>© 2023 Bing</p>
      </footer>
    </div>
  );
};

export default App;
