import React, { Component } from "react";
import { allowOnlyOneTab } from "../../common/utils/common";

class CloseTabs extends Component {
    componentDidMount() {
        allowOnlyOneTab(null, '/');
    }

    render() {
        return (
            <div>
                Please close the other tab;
            </div>
        )
    }
}

export default CloseTabs;