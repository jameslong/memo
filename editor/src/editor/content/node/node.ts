import EditorMessage = require('../../../editormessage');
import React = require('react');
import ReactUtils = require('../../../redux/react');

import Core = require('../../common/core');
import Div = Core.Div;
import Absolute = require('../../common/absolute');
import Draggable = require('../../common/draggable');

interface NodeProps {
        message: EditorMessage.EditorMessage;
        onClick: (e: MouseEvent) => void;
};

function renderNode (props: NodeProps)
{
        const message = props.message;
        const name = message.name;
        const position = message.position;
        const nameProps = { value: name };
        const selected = message.selected;
        const invalid = !message.valid;
        const className = ReactUtils.classNames(
                'node',
                { ['node-selected']: selected },
                { ['node-invalid']: invalid });

        const nodeProps = {
                className: className,
                onClick: props.onClick,
        };

        return Absolute({ coord: position },
                Draggable(nameProps,
                        Div(nodeProps,
                                Div({ className: 'node-title' },
                                        name)
                        )
                )
        );
}

const Node = React.createFactory(renderNode);

export = Node;
