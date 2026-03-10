import { type PropsWithChildren, Fragment } from 'react';
import type { BoxOptions } from '@opentui/core';
import { BorderBox } from 'core/components';

interface VerticalSplitProps {
    style?: BoxOptions,
    withBorder?: boolean
}

const VerticalSplit = (props: PropsWithChildren<VerticalSplitProps>) => {
    const { style = {}, children, withBorder = false } = props;

    if (!children || !Array.isArray(children) || !children.length) {
        return null;
    }

    if (children.length !== 2) {
        return <box style={{ flexDirection: "column", ...style }}>
            {children}
        </box>
    }

    const Wrapper = withBorder ? BorderBox : Fragment;

    return <box style={{ flexDirection: "column", ...style }}>
        <Wrapper>
            {children[0]}
        </Wrapper>
        <Wrapper>
            {children[1]}
        </Wrapper>
    </box>
}

export default VerticalSplit;
