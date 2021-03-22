function Control(
    el,
    {
        value = 0,
        step = 1,
        max = 100,
        min = 0,
        maxAngle = 360,
        minAngle = 0,
    } = {}
) {
    const img = document.createElement("img");
    img.src = "./1@3xNew.png";
    img.width = "200";
    el.append(img);

    const ratio = (maxAngle - minAngle) / (max - min);

    const value2Deg = () => ratio * (value - min) + minAngle;

    const changeValue = (delta, fireEvent = false) => {
        let newValue = value + delta;
        if (newValue >= max) newValue = max;
        if (newValue <= min) newValue = min;

        value = newValue;

        //console.log(value)

        if (fireEvent && this.onChange && typeof this.onChange === "function") {
            this.onChange(value);
        }

        img.style.transform = `rotate(${value2Deg()}deg)`;
        img.style.transformOrigin = `50% 50%`;
    };

    const { top, left } = img.getBoundingClientRect();

    changeValue(0);

    // console.log(img.width, top, left);

    // img.onclick = (e) => {
    //     changeValue(e.clientX - left > img.width / 2 ? step : -step, true);
    // };

    img.onmousewheel = (e) => {
        changeValue((e.deltaY * step) / 25, true); // "/25" - это для  лучшей чуствительности для мышки
        e.preventDefault();
    };

    let startDragAngle;

    const calcAngle = ({ layerX, layerY }) => {
        const deltaX = layerX - img.width / 2;
        const deltaY = layerY - img.height / 2;
        return (Math.atan2(deltaY, deltaX) / Math.PI) * 180;
    };

    img.onmousedown = (e) => {
        startDragAngle = calcAngle(e);
        e.preventDefault();
    };

    img.onmousemove = (e) => {
        if (startDragAngle !== undefined) {
            const currentAngle = calcAngle(e);
            let deltaAngle = currentAngle - startDragAngle;

            // дальше идет коррекция перехода через +-180 градусов
            // но из-за функции onclick осталось иногда подергивание
            // при выкручивании в крайние положения
            // onclick пришлось отключить
            if (Math.abs(deltaAngle) >= 180) {
                deltaAngle += deltaAngle < 0 ? 360 : -360;
            } else {
                deltaAngle += deltaAngle < 0 ? -360 : 360;
            }
            deltaAngle = Math.round(deltaAngle % 360);

            changeValue(deltaAngle / ratio, true);
            startDragAngle = currentAngle;
            e.preventDefault();
        }
    };
    img.onmouseup = img.onmouseout = (e) => {
        if (startDragAngle) {
            startDragAngle = undefined;
            e.preventDefault();
        }
    };
    this.setValue = (v) => changeValue(v - value);
    this.changeValue = changeValue;
    this.getValue = () => value;
}
const audio = document.getElementById("myaudio");
// для пробы коррекции перехода через +-180 сделал крутилку на 2 оборота
const volumeControl = new Control(volume, {
    max: 1,
    min: 0,
    step: 0.01,
    maxAngle: 720,
});
volumeControl.onChange = (value) => {
    audio.volume = value;
    volumeLevel.value = value;
    console.log("VOLUME ", volumeLevel.value);
};
volumeLevel.oninput = () => {
    audio.volume = volumeLevel.value;
    volumeControl.setValue(audio.volume);
    console.log("VOLUME ", volumeControl.getValue());
};
volumeLevel.value = 0;
audio.volume = 0;