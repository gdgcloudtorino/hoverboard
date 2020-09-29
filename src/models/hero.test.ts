import { allKeys } from './utils';

type Hero = import('./hero').Hero;

describe('hero', () => {
  it('matches the shape of the default data', () => {
    const heros: Hero[] = [
      {
        backgroundColor: '/images/backgrounds/home.jpg',
        backgroundImage: '#01025a',
        fontColor: '#fff',
        hideLogo: true,
      },
    ];
    const keys: Array<keyof Hero> = ['backgroundColor', 'backgroundImage', 'fontColor', 'hideLogo'];
    expect(heros).toHaveLength(1);
    expect(allKeys(heros)).toStrictEqual(keys);
  });
});
