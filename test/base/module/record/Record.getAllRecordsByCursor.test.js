import Auth from '../../../../src/node/authentication/Auth';
import Connection from '../../../../src/node/connection/Connection';
import Record from '../../../../src/base/module/record/Record';
import {URI, USERNAME, PASSWORD, DOMAIN} from './common';
import nock from 'nock';
import KintoneAPIException from '../../../../src/base/exception/KintoneAPIException';

const auth = new Auth();
auth.setPasswordAuth({username: USERNAME, password: PASSWORD});
const connection = new Connection({auth, domain: DOMAIN});
const recordModule = new Record({connection});

const CURSOR_ROUTE = '/k/v1/records/cursor.json';

describe('Checking Record.getAllRecordsByCursor', () => {
  it('should be called successfully', () => {
    const app = 1;
    const fields = [];
    const query = '';

    const EXPECTED_GET_RECORDS_RESPONSE = {
      records: [
        {
          'Record_number': {
            'type': 'RECORD_NUMBER',
            'value': '1'
          }
        }
      ],
      next: false
    };

    const EXPECTED_CREATE_CURSOR_RESPONSE = {
      id: '123',
      totalCount: 1
    };

    nock(URI)
      .post(CURSOR_ROUTE, (rqBody) => {
        expect(rqBody.app).toEqual(app);
        expect(rqBody.fields).toEqual(fields);
        expect(rqBody.query).toEqual(query);
        return true;
      })
      .reply(200, EXPECTED_CREATE_CURSOR_RESPONSE)
      .get(CURSOR_ROUTE)
      .query({
        id: EXPECTED_CREATE_CURSOR_RESPONSE.id
      })
      .reply(200, EXPECTED_GET_RECORDS_RESPONSE);

    return recordModule.getAllRecordsByCursor({app, query, fields})
      .then((recordsResponse) => {
        expect(recordsResponse).toHaveProperty('records');
        expect(Array.isArray(recordsResponse.records)).toBe(true);
        expect(recordsResponse).toHaveProperty('totalCount');
        expect(recordsResponse.records.length).toEqual(recordsResponse.totalCount);
      });
  });

  it('should throw error when called with empty param', () => {
    const expectedErrString = 'Error: app is a required argument.';
    return recordModule.getAllRecordsByCursor()
      .catch(err => {
        expect(err).toBeInstanceOf(KintoneAPIException);
        expect(err.toString()).toEqual(expectedErrString);
      });
  });

  it('should delete created cursor when not fetch all records', () => {
    const app = 1;
    const fields = [];
    const query = '';

    const EXPECTED_GET_RECORDS_RESPONSE = {
      records: [
        {
          'Record_number': {
            'type': 'RECORD_NUMBER',
            'value': '1'
          }
        }
      ],
      next: false
    };

    const EXPECTED_CREATE_CURSOR_RESPONSE = {
      id: '123',
      totalCount: 3
    };

    nock(URI)
      .post(CURSOR_ROUTE, (rqBody) => {
        expect(rqBody.app).toEqual(app);
        expect(rqBody.fields).toEqual(fields);
        expect(rqBody.query).toEqual(query);
        return true;
      })
      .reply(200, EXPECTED_CREATE_CURSOR_RESPONSE)
      .get(CURSOR_ROUTE)
      .query({
        id: EXPECTED_CREATE_CURSOR_RESPONSE.id
      })
      .reply(200, EXPECTED_GET_RECORDS_RESPONSE)
      .delete(CURSOR_ROUTE)
      .reply(200, {});

    return recordModule.getAllRecordsByCursor({app, query, fields})
      .then((recordsResponse) => {
        expect(recordsResponse).toHaveProperty('records');
        expect(Array.isArray(recordsResponse.records)).toBe(true);
        expect(recordsResponse).toHaveProperty('totalCount');
      });
  });

  it('should throw error when fail to create cursor', () => {
    const app = -1;
    const fields = [];
    const query = '';

    const INVALID_INPUT_RETURN = {
      id: 'RWt7OV6Pa40r1E3a2hgb',
      code: 'CB_VA01',
      message: 'Missing or invalid input.',
      errors: {
        app: {
          messages: ['must be greater than or equal to 1']
        }
      }
    };

    nock(URI)
      .post(CURSOR_ROUTE)
      .reply(400, INVALID_INPUT_RETURN);

    return recordModule.getAllRecordsByCursor({app, fields, query})
      .catch((err) => {
        expect(err).toBeInstanceOf(KintoneAPIException);
        expect(err.get()).toMatchObject(INVALID_INPUT_RETURN);
      });
  });

  it('should delete cursor when getAllRecord fail', () => {
    const app = 1;
    const fields = [];
    const query = '';

    const EXPECTED_CREATE_CURSOR_RESPONSE = {
      id: '123',
      totalCount: 3
    };

    nock(URI)
      .post(CURSOR_ROUTE, (rqBody) => {
        expect(rqBody.app).toEqual(app);
        expect(rqBody.fields).toEqual(fields);
        expect(rqBody.query).toEqual(query);
        return true;
      })
      .reply(200, EXPECTED_CREATE_CURSOR_RESPONSE)
      .get(CURSOR_ROUTE)
      .query({
        id: EXPECTED_CREATE_CURSOR_RESPONSE.id
      })
      .reply(400)
      .delete(CURSOR_ROUTE)
      .reply(200, {});

    return recordModule.getAllRecordsByCursor({app, query, fields})
      .catch((err)=>{
        expect(err).toBeInstanceOf(KintoneAPIException);
      });
  });
});