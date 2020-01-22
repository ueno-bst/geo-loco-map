describe('a', () => {
    it('b', () => {
        for (let i = 10; i < 100; i++) {
            console.assert(90 == i);
        }
    });

    it('c', () => {
        const lat = 35.0;
        let j = 360;

        for (let i = 0; i < 20; i++) {
            j /= 2;
            let mod = lat % j;
            console.info(`${lat} % ${j} ... ${mod} : ${lat + mod} > ${lat - mod}`);
        }
    });

    it('d', () => {
        let round = 5.625 / 2 / 2;

        for (let lat = 34.0; lat <= 36; lat += 0.10) {
            lat = numberFix(lat);
            let mod = numberFix(lat % round);
            console.info(`${numberFix(lat)} % ${numberFix(round)} ... ${numberFix(mod)} : ${numberFix((lat + mod) - (lat % round))} > ${numberFix(lat - mod)}`);
        }
    });

    it('e', () => {
        for (let i = -1080; i <= 1080; i += 60) {
            let mod = Math.round(i / 360);

            let j = i - mod * 360;

            console.info(i, mod, j);
        }
    });

    it('f', () => {
        const base = 360.0;
        for (let i = 0.0; i < 20.0; i ++) {
            let loop = base;
            for (let j = 0; j < i; j++) {
                loop /= 2;
            }

            let mod = base >>> i;

            console.info(i, base, loop.toFixed(30), mod.toFixed(30), loop.toString(2), mod.toString(2));
        }

    });
});

function numberFix(value: number, precision: number = 10) {
    return Number(value.toFixed(precision));
}