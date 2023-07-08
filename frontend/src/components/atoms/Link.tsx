export const Link = (props) => {
    const { url, children } = props
    return (
        <a href={url} target="_blank" rel="noreferrer">
            {children}
        </a>
    );
};