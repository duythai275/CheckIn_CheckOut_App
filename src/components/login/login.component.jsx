import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

import avatar from '../../assets/avatar.png';

import FormDialog from '../log/log.component';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Minho Choi
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '70%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const Employee = ({employee, addData}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleLogon = ( status, time ) => {
    let data = {
      "Date": time.substring(0,15)
    };

    data["status"] = status;
    data["time"] = time.substring(16,24);

    addData(data, employee.Name);
  }

  return (
  <Grid item xs={3} sm={3}>
    <Card className={classes.card} onClick={() => setOpen(true)}>
      <CardActionArea>
        <CardMedia
          className={classes.cardMedia}
          image={avatar}
          title="Image title"
        />
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant="h5" component="h2">
            {employee.Name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    <FormDialog open={open} employee={employee} handleClose={() => setOpen(false)} logon={handleLogon}/>
  </Grid>
)}

export default function Album() {
  const classes = useStyles();
  const [employees, setEmployees] = useState([]);
  const [sheets, setSheets] = useState({});

  const handleUpload = (e) => {
    e.preventDefault();
    
    var files = e.target.files, f = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        var data = e.target.result;
        let readedData = XLSX.read(data, {type: 'binary'});
        const wsname = readedData.SheetNames[0];
        const ws = readedData.Sheets[wsname];

        /* Convert array to json*/
        let newSheets = {};
        readedData.SheetNames.forEach( sheetName => {
          newSheets[sheetName] = XLSX.utils.sheet_to_json(readedData.Sheets[sheetName]);
        });

        setSheets(newSheets);
        setEmployees(newSheets["Passcode"]);
    };
    reader.readAsBinaryString(f)
  }

  const handleUpdate = () => {
    let wb = {
      Sheets: {},
      SheetNames: []
    }
    Object.keys(sheets).forEach( k => {
      wb.Sheets[k] = XLSX.utils.json_to_sheet(sheets[k]);
      wb.SheetNames.push(k);
    });

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
    FileSaver.saveAs(data, 'data.xlsx');
  }

  const handleEvent = (data, name) => {
    let newSheets = sheets;
    let flag = true;
    if ( !newSheets.hasOwnProperty(name) ) newSheets[name] = [];
    newSheets[name].forEach( row => {
      if ( row.Date === data.Date ) {
        row[data.status] = data.time;
        flag = false;
      }
    });
    if(flag) {
      let newRow = {
        "Date": data.Date
      };
      newRow[data.status] = data.time
      newSheets[name].push(newRow);
    }

    setSheets(newSheets);
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Attention Tracking
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <label htmlFor="upload-photo">
                    <input
                      style={{ display: "none" }}
                      id="upload-photo"
                      name="upload-photo"
                      type="file"
                      onChange={handleUpload}
                    />
                    <Button color="secondary" variant="contained" component="span">
                      Open Timesheet
                    </Button>{" "}
                  </label>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary" component="span" onClick={handleUpdate}>
                    Update Timesheet
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={6}>
            {employees.map( (employee, index) => (
              <Employee key={index} employee={employee} addData={handleEvent} />
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}