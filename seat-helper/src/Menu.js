import { connect } from 'react-redux';
import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';
import {
    getMenu,
    getZoneInfo,
    getActivatedZones,
    createAddZone,
    createRemoveZone,
} from './redux';
import styled from 'styled-components'

const FileLoader = ({ onFileSelected }) => {
    const fileInputRef = useRef(null);

    function handleClick() {
        fileInputRef.current.value = '';
        fileInputRef.current.click();
    }

    return (
        <div
            key="FileLoader"
            style={{
                paddingTop: '10px',
            }}
        >
            <input
                type="file"
                id="file-input"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => {
                    onFileSelected(e.target.files[0]);
                }}
            />
            <Button
                variant="info"
                onClick={handleClick}>Browse and Load CSV</Button>
            <div
                style={{
                    display: 'inline-block',
                    left: '10px',
                    position: 'relative',
                }}
            >
                No File Loaded
            </div>
        </div>
    );
};

const MenuContainer = styled.div`
    border-radius: 10px;
    font-size: 16px;
    color: white;
    left: 30vw;
    width: 40vw;
    padding: 10px;
    top: 150px;
    position: fixed;
    text-align: center;
    background: rgba(150, 150, 150, 0.95);
`

const ZoneSelect = styled.div`
    padding: 10px;
    display: block-inline;
`

const Menu = ({ menu, zoneInfo, activatedZones, onAddZone, onRemoveZone }) => {
    if (menu) {
        const zonesbuttons = zoneInfo.map(zone => {
            const activated = activatedZones.indexOf(zone.id) !== -1;
            return <Button variant={activated ? "primary" : "outline-primary"}
                onClick={() => activated ? onRemoveZone(zone.id) : onAddZone(zone.id)}
                className="ml-1">{zone.id}</Button>
        })

        return <MenuContainer>
            <h2>Options and Settings</h2>
            <FileLoader></FileLoader>
            <ZoneSelect>
                Select Active Zones
                {zonesbuttons}
            </ZoneSelect>
            <Button variant="info" className="mt-1">Send Report</Button>
        </MenuContainer>
    } else {
        return null;
    }
};

const mapStateToProps = state => ({
    menu: getMenu(state),
    zoneInfo: getZoneInfo(state),
    activatedZones: getActivatedZones(state),
});

const mapDispatchToProps = dispatch => ({
    onAddZone: (id) => dispatch(createAddZone(id)),
    onRemoveZone: (id) => dispatch(createRemoveZone(id)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Menu);
