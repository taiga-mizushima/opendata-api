import { Sidebar } from "../organisms/Sidebar";

export const MainTemplate = (props) => {
    return (
        <div className="main">
            <Sidebar />
            <div className="content">
                {props.children}
            </div>
        </div>
    );
};
