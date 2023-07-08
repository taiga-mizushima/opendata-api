import { Logo } from "../molecules/Logo";
import { Title } from "../atoms/Title";

export const Header = () => {
    return (
        <div className="header">
            <Logo />
            <Title>乗降者数検索</Title>
        </div>
    );
};
