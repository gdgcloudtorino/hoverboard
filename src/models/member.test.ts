import data from '../../docs/default-firebase-data.json';
import { allKeys } from './utils';

type Member = import('./member').Member;

describe('partner', () => {
  it('matches the shape of the default data', () => {
    const members: Member[] = Object.values(data['team'][0]['members']);
    const keys: Array<keyof Member> = ['name', 'order', 'photo', 'photoUrl', 'socials', 'title'];
    expect(members).toHaveLength(8);
    expect(allKeys(members)).toStrictEqual(keys);
  });
});
