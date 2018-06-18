const express = require('express');
const app = express();
const axios = require('axios');

const instance = axios.create({
  baseURL: 'https://api.airtable.com/v0/appyYO6TiExpMlFjt',
  headers: {Authorization: 'Bearer keyF5RqI6oSraQNK7'},
});

app.get('/:lookupID', async (req, res, next) => {
  try {
    const {
      data: {records},
    } = await instance.get('/Event_Attendee', {
      params: {
        maxRecords: 1,
        view: 'Grid view',
        filterByFormula: `({redirect_lookup_id})="${req.params.lookupID}"`,
      },
    });

    // check if record is found
    if (records.length !== 0) {
      const record = records[0];
      // check if required fields for this redirect are present.
      if (
        'event_link' in record.fields &&
        'attendee_full_name' in record.fields
      ) {
        const acLink = record.fields.event_link[0];
        const encodedGuestName = encodeURIComponent(
          record.fields.attendee_full_name[0]
        );
        return res.redirect(`${acLink}?guestName=${encodedGuestName}`);
      }

      return res.json({message: 'Ac link or Attendee Name fields missing.'});
    }

    return res.json({message: 'No Attendee with that link is found.'});
  } catch (error) {
    next(error);
  }
});

const port = process.env.port || 8000;

app.listen(port, () => {
  console.log('Example app listening on 8000 port!');
});
