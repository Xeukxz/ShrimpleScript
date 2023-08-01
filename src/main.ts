$(() => {
    // Get the code from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    // decode from base64 
    const quickCode = atob(decodeURIComponent(urlParams.get('code') ?? "LyoqCiAqIEBvcHRpb24gT3B0aW9uIFRpdGxlLCBFeGFtcGxlIFZhbHVlCiAqIEBvcHRpb24gT3B0aW9uIFRpdGxlIDIsIEV4YW1wbGUgVmFsdWUyCiAqLwoKbGV0IG9wdGlvbjEgPSBvcHRpb25zWzBdIC8vIHJldHVybnMgdGhlIHZhbHVlIG9mIGZpcnN0IG9wdGlvbgpsZXQgb3B0aW9uMiA9IG9wdGlvbnNbMV0gLy8gcmV0dXJucyB0aGUgdmFsdWUgb2Ygc2Vjb25kIG9wdGlvbgoKCgpyZXR1cm4gb3B0aW9uMSArIG9wdGlvbjIKCg=="))

    // Update the page content with the code
    if (quickCode) $(`#ScriptBox`).val(quickCode)
    let ops: any[] = []

    // $(`#ScriptBox`).html(`/**\n * @option Option Title, Example Value\n * @option Option Title 2, Example Value2\n */\n\nlet option1 = options[0] // returns the value of first option\nlet option2 = options[1] // returns the value of second option\n\n\n\nreturn option1 + option2\n\n`)
    setTimeout(() => loadOptions())

    ops.forEach((option, index) => {
        $("#options").append(`
            <div class="option" id="option-${index}">
                <div class="optionHead">${option.title}</div>
                <input class="optionInput" id="input-1" placeholder="${option.example}">
            </div>
        `)
    })

    $(`#runButton`).on("click", () => {
        run()
    })

    $(`#ScriptBox`).on("keydown", (e) => {
        let code = $(`#ScriptBox`).html()
        setTimeout(() => loadOptions())
    })

    async function run() {
        let options = new Object()

        let code = $(`#ScriptBox`).val()
        
        $(`.optionInput`).each((index, element) => {
            let id = Number($(element).attr("id")?.replace("input-", "")) ?? index
            let value = $(element).val();

            (options as any)[index] = value
        })

        let output
        try{
            output = await eval(`(async () => {${code}})()`)
        } catch (e) {
            console.log(e)
            output = e
        }


        $(`#ResultModal`).css("display", "flex")

        $(`#resultText`).html(`<code>${output}</code`)
        

        
    }

    function loadOptions() {
        let code = $(`#ScriptBox`).val() as string
        let options = code.split('@option').map((str, i) => str.replace(str.slice(str.indexOf('\n')), '').trim().split(',').map(val => val.trim())).splice(1)

        if(ops == options) return
        ops = options
        
        $("#options").html("")
        if(options.length < 1) return

        ops.forEach((option, index) => {
            $("#options").append(`
                <div class="option" id="option-${index}">
                    <div class="optionHead">${option[0]}</div>
                    <input class="optionInput" id="input-1" placeholder="${option[1]}">
                </div>
            `)
        })
    }


    $(`#helpButton`).on("click", () => {
        // if display is none
        if($(`#helpModal`).css("display") == "none") return $(`#helpModal`).css("display", "flex")
        $(`#helpModal`).css("display", "none")
    })
    $(`.closeModalButton`).on("click", () => {
        $(`#helpModal`).css("display", "none")
        $(`#ResultModal`).css("display", "none")
    })

    $(`#runButton`).on("click", async () => {
        await run()
    })

    

    $(`#shareButton`).on("click", () => {
        let code = $(`#ScriptBox`).val() as string
        // convert code to base64
        let base64 = btoa(code)
        // create url
        let url = `${window.location.href.split('?code=')[0]}?code=${encodeURIComponent(base64)}`
        
        // copy url to clipboard
        navigator.clipboard.writeText(url)
        $(`#shareButton`).html("Copied!")
        setTimeout(() => {
            $(`#shareButton`).html("Share")
        }, 1000);

    })

    $(`#newButton`).on("click", () => {
        //go to new page
        window.location.href = window.location.href.split('?')[0]

    })

    //for each child of body, give rotate animation
    /* $(`body`).children().each((index, element) => {
        $(element).css("animation", `rotate 2s ease-in-out ${index * 0.1}s infinite`)
    }) */
    
})