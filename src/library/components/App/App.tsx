import { BorderBox } from "core/components";

const App = () => {
    return (
        <BorderBox
            style={{
                alignItems: "center",
                justifyContent: "center",
                flexGrow: 1,
            }}
        >
            <text>GameBox</text>
            <text>Description</text>
        </BorderBox>
    );
};

export default App;
