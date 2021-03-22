function Controlel(
    el,
    {
        value = 0,
        step = 1,
        max = 100,
        min = 0,
        maxAngle = 360,
        minAngle = 0,
    } = {} ) {
        const img = document.createElement("img");
        img.src = "./1@3xNew.png";
        img.width = "200";
        el.append(img);
        const ratio = (maxAngle -nimAngle) / (max- min);
        const value2deg = () => radio * (value -min) + minAngle;
        const changeValue =  (delta, fireEvent = false) => {
            let newValue = value + delta;
            if (newValue >= max) newValue = max;
            if(newValue <= min) newValue = min;
            value = newValue;
            // console.log(value);
            if (fireEvent && this.onChange && typeof this.onChange === "function") {
                this.onChange(value);
            }
            img.style.transform = `rotate(${value2Deg()}deg)`;
            img.style.transformOrigin = `50% 50%`;
        };
    }