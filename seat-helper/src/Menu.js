import { connect } from 'react-redux';
import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';
import {
    getMenu,
    getZoneInfo,
    getPeople,
    getActivatedZones,
    getLoadedFile,
    getActiveTickets,
    createAddZone,
    createRemoveZone,
    loadFile,
    downloadFile,
    createRemoveActiveTickets,
    createAddActiveTickets,
} from './redux';
import styled from 'styled-components'

const FileLoader = ({ loadedFile, onFileSelected }) => {
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
                {loadedFile != null ? `Loaded: ${loadedFile}` : 'No File Loaded'}
            </div>
        </div>
    );
};

const MenuContainer = styled.div`
    border-radius: 10px;
    font-size: 16px;
    color: white;
    left: 20vw;
    width: 60vw;
    padding: 10px;
    top: 100px;
    position: fixed;
    text-align: center;
    background: rgba(150, 150, 150, 0.95);
`

const ZoneSelect = styled.div`
    padding: 10px;
    display: block-inline;
`

const Menu = ({ menu,
    zoneInfo,
    people,
    activatedZones,
    activatedTix,
    loadedFile,
    onAddZone,
    onRemoveZone,
    onFileSelected,
    onDownloadFile,
    onRemoveTix,
    onAddTix,
}) => {

    const alloczones = []
    const alloctix = []
    const tixlist = []
    people.forEach(person => {
        if (person.allocZone != null && alloczones.indexOf(person.allocZone) === -1) {
            if (alloctix.indexOf(person.tixType) === -1) {
                alloctix.push(person.tixType)
            }
            alloczones.push(person.allocZone);
        }
        if (tixlist.indexOf(person.tixType) === -1) {
            tixlist.push(person.tixType);
        }
    });
    console.log(alloctix)

    if (menu) {
        const tixbuttons = tixlist.map(ticket => {
            const activated = activatedTix.indexOf(ticket) !== -1;
            const occupied = alloctix.indexOf(ticket) !== -1;
            return <Button variant={activated ? occupied ? "secondary" : "primary" : "outline-primary"}
                onClick={() => activated ? occupied ? () => { } : onRemoveTix(ticket) : onAddTix(ticket)}
                className="ml-1">{ticket}</Button>
        })

        const zonesbuttons = zoneInfo.map(zone => {
            const activated = activatedZones.indexOf(zone.id) !== -1;
            const occupied = alloczones.indexOf(zone.id) !== -1;
            return <Button variant={activated ? occupied ? "secondary" : "primary" : "outline-primary"}
                onClick={() => activated ? occupied ? () => { } : onRemoveZone(zone.id) : onAddZone(zone.id)}
                className="ml-1">{zone.id}</Button>
        })

        return <MenuContainer>
            <h2>Options and Settings</h2>
            <FileLoader onFileSelected={onFileSelected} loadedFile={loadedFile}></FileLoader>
            <hr></hr>
            <ZoneSelect>
                Select Active Tickets
                {tixbuttons}
            </ZoneSelect>
            <hr></hr>
            <ZoneSelect>
                Select Active Zones
                {zonesbuttons}
            </ZoneSelect>
            <hr></hr>
            <Button variant="info" className="mt-1"
                onClick={() =>
                    onDownloadFile(`${loadedFile.replace(/\.[^/.]+$/, "")}_${Date.now()}_report.csv`)}>
                Download Report
            </Button>
        </MenuContainer>
    } else {
        return null;
    }
};

const mapStateToProps = state => ({
    menu: getMenu(state),
    zoneInfo: getZoneInfo(state),
    people: getPeople(state),
    activatedZones: getActivatedZones(state),
    activatedTix: getActiveTickets(state),
    loadedFile: getLoadedFile(state),
});

const mapDispatchToProps = dispatch => ({
    onAddZone: (id) => dispatch(createAddZone(id)),
    onRemoveZone: (id) => dispatch(createRemoveZone(id)),
    onFileSelected: (fileDetails) => dispatch(loadFile(fileDetails)),
    onDownloadFile: (fileName) => dispatch(downloadFile(fileName)),
    onRemoveTix: (ticket) => dispatch(createRemoveActiveTickets(ticket)),
    onAddTix: (ticket) => dispatch(createAddActiveTickets(ticket)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Menu);
