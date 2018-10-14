import React, { Component } from 'react'

export default class AdministrationInfos extends Component {
    render() {
        return (
            <div>
                <div className="admin-dashboard-info">
                    <p>{this.props.measureTitle}</p>
                    <h3>{this.props.measuredValue}</h3>
                    <p>{this.props.measuredValueState}</p>
                </div>
            </div>
        )
    }
}
