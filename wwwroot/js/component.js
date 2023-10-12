//  <reference path="../typings/tsd.d.ts" />

function TextRecive(state, name, message, date, time) {
    return `
                <div class="message">
                <div class="${state}">
                    <span class="username">${name}</span>
                    <span class="main text">
                        <span class="angle"></span> ${message}
                        <span class="info">
                            <span class="datetime"> ${date} - ${time}</span> &nbsp;
                            <span class="isChecked"><i class="bi bi-check-all"></i></span>
                        </span>
                    </span>
                </div>
            </div>
    `;
}

function userJoin(name, date, time) {
    return `
           <div class="text-center">
            <span class="inline-block p-2 m-4 rounded-lg bg-zinc-800 text-zinc-50">
                ${name} joined <br />
                at <span class="text-[13px]"> ${time} &nbsp;  ${date}</span>
            </span>
           </div>
`;
}

function Uploading(name) {

    return `
    <div id="${_username}" class="message">
    <div class="send">
        <span class="username">${name}</span>
        <span class="main voice w-[calc(100%-1rem)] min-[360px]:w-80">
        <span>
        <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        </div>
        </span> 
            <span class="angle"></span>
        </span>
    </div>
</div>
    `;
}

function AudioReceiveComplete(state, name, audioPath, date, time) {
    return `
        <div class="message">
        <div class="${state}">
            <span class="username">${name}</span>
            <span class="main uploading w-[calc(100%-1rem)] min-[360px]:w-80">
            <audio  class="w-full" controls controlsList="nodownload noplaybackrate">
            <source src="/audios/${audioPath}" type="audio/wav" />
            Your browser does not support the audio element.
        </audio>
                <span class="angle"></span>
                <span class="info">
                    <span class="datetime"> ${date} - ${time}</span> &nbsp;
                    <span class="isChecked"><i class="bi bi-check-all"></i></span>
                </span>
            </span>
        </div>
    </div>`
}

function imageReceive(state, name, image, date, time, id) {
    return `
    <div class="message">
    <div class="${state}">
        <span class="username">${name}</span>
        <span class="main image">
            <img id="${id}" class="imgChat rounded   xs:max-w-[22rem]"
                src="/Images/${image}" alt="" />
            <span class="angle"></span>
            <span class="mt-1 info">
            <span class="datetime"> ${date} - ${time}</span> &nbsp;
            <span class="isChecked"><i class="bi bi-check-all"></i></span>
        </span>
        </span>
    </div>
</div>
`
}



