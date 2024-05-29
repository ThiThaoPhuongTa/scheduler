import schedules from "./schedules.json" assert {type: 'json'};
class HourMap {
    minutes = BigInt(0);
    toBin() {
        return this.minutes.toString(2).padStart(60, '0');
    }

    range(from, to) {
        return (BigInt(1) << BigInt(to)) - (BigInt(1) << BigInt(from));
    }

    busy(from, to) {
        this.minutes |= this.range(from, to);

        return this
    }

    isBusy(minute) {
        return (this.minutes & (BigInt(1) << BigInt(minute))) > BigInt(0);
    }

    free(from, to) {
        return this.minutes &= ~this.range(from, to);
    }
}

let hourMinutes = Array(24).fill(0).map(() => new HourMap())
schedules.flatMap(s => s.times)
    .forEach(t => {
        const [start, end] = t.split("~")
        const [startHour, startMinute] = start.split(":").map(Number)
        const [endHour, endMinute] = end.split(":").map(Number)

        hourMinutes[startHour].busy(startMinute, endMinute)
    })

let schedulesHTML = '';

hourMinutes.forEach((minutes, index) => {
    schedulesHTML += `
      <div>
        <span style="display: inline-block; width: 1.5em;">
            ${index.toString().padStart(2, "0")}
        </span>
        ${minutes.toBin().split("").reverse()
            .map(minute => minute === '0' ? 
                '<span class="free">_</span>' : 
                '<span class="busy">_</span>'
            ).join('')
        }
      </div>
    `;
});

document.querySelector('.js-schedules').innerHTML = schedulesHTML;