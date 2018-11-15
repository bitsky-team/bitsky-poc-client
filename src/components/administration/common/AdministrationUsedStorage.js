import React, { Component } from 'react'

export default class AdministrationUsedStorage extends Component {

    render() {
        return (
            <div>
                <div className={(this.props.warning) ? 'admin-dashboard-storage warning' : 'admin-dashboard-storage'}>
                    <h5>{this.props.diskNumber}</h5>
                    <div className="used-volume-info">
                        <div className="used-volume"></div>
                        <div>
                            <h3>{this.props.usedVolume}GB</h3>
                            <p>sur {this.props.totalVolume}GB</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
}
