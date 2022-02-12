import { connect } from 'react-redux';
import React, { useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Button, FormControl } from 'react-bootstrap';
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
    createResetData,
    createUnmenu,
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
                    top: '5px',
                    position: 'relative',
                }}
            >
                {loadedFile != null ? `Loaded: ${loadedFile}` : 'No File Loaded'}
            </div>
        </div>
    );
};

const ZoneSelect = styled.div`
    padding: 10px;
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
    onResetData,
    onUnmenu,
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
        if (person.tixType !== 'On Entry' && tixlist.indexOf(person.tixType) === -1) {
            tixlist.push(person.tixType);
        }
    });
    // Sort the ticket list to be consistent
    tixlist.sort()

    const [resetOk, setResetOk] = useState(false);

    const tixbuttons = tixlist.map(ticket => {
        const activated = activatedTix.indexOf(ticket) !== -1;
        const occupied = alloctix.indexOf(ticket) !== -1;
        return <div className="mt-1"><Button variant={activated ? occupied ? "secondary" : "primary" : "outline-primary"}
            onClick={() => activated ? occupied ? () => { } : onRemoveTix(ticket) : onAddTix(ticket)}
            className="ml-1">{ticket}</Button></div>
    })

    const zonesbuttons = zoneInfo.map(zone => {
        const activated = activatedZones.indexOf(zone.id) !== -1;
        const occupied = alloczones.indexOf(zone.id) !== -1;
        return <Button variant={activated ? occupied ? "secondary" : "primary" : "outline-primary"}
            onClick={() => activated ? occupied ? () => { } : onRemoveZone(zone.id) : onAddZone(zone.id)}
            className="ml-1">{zone.id}</Button>
    })

    return <Dialog open={menu} onClose={() => onUnmenu()}
        PaperProps={{
            style: {
                backgroundColor: 'rgba(200, 200, 200, 0.95)',
                borderRadius: '10px',
                padding: '20px'
            },
        }}
        sx={{ textAlign: 'center', fontSize: '16px' }}>
        <DialogTitle disableTypography>
            <IconButton onClick={() => onUnmenu()} sx={{ float: 'right' }}>
                <CloseIcon />
            </IconButton>
            <h2>Options and Settings</h2>
        </DialogTitle>
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
        <hr></hr>
        <FormControl type='text' placeholder="Type 'RESET' here"
            onChange={(e) => e.target.value === 'RESET' ? setResetOk(true) : setResetOk(false)}></FormControl>
        <Button variant="info" className="mt-1"
            disabled={!resetOk}
            onClick={() => resetOk ? onResetData() && setResetOk(false) : () => { }}>
            Reset To Test data
        </Button>
    </Dialog >
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
    onResetData: () => dispatch(createResetData()),
    onUnmenu: () => dispatch(createUnmenu()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Menu);
