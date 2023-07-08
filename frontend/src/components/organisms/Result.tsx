import { Paragraph } from "../atoms/Paragraph";

export const Result = (props) => {
    const { passengers, station, error} = props
    return (
        <div className="result">
            {passengers && (
                <Paragraph>
                    {station}の乗降者数は{passengers}人です。
                </Paragraph>
            )}
            {error && <Paragraph>{error}</Paragraph>}
        </div>
    );
};
