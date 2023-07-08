import { List } from "../atoms/List";

export const Sidebar = () => {
    const items = ["item01", "item02", "item03"];
    return (
        <div className="sidebar">
            <List items={items} />
        </div>
    );
};
