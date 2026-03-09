import type { SelectOption, SelectRenderableOptions } from '@opentui/core';
import { DefaultTheme } from 'core/themes';

type MenuProps = {
    style?: Partial<SelectRenderableOptions>;
    options: SelectOption[];
    selectedIndex: number,
    onChange: (index: number) => void,
}

const Menu = (props: MenuProps) => {
    const {
        style = {},
        options = [],
        selectedIndex = 0,
        onChange = () => {}
    } = props

    if (!options) {
        return null;
    }

    return <box style={style}>
        <select
            style={{
                width: "20%",
                height: options.length,
                margin: "auto",
                showDescription: false,
                textColor: DefaultTheme.mauve,
                backgroundColor: "#00000000",
                focusedTextColor: false ? DefaultTheme.peach : DefaultTheme.mauve,
                focusedBackgroundColor: "#00000000",
                selectedTextColor: false ? DefaultTheme.base : DefaultTheme.mauve,
                selectedBackgroundColor: false ? DefaultTheme.peach : "#00000000",
            }}
            options={options}
            focused={true}
            onChange={index => { onChange(index) }}
        />
    </box>
}

export default Menu;
