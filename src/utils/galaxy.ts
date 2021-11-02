//TODO: change to Star Atlas feed before merge
const JSON = "galaxy.json";

export const GALAXY = async () => {
    const result = await fetch(JSON
        , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    if (result.ok) {
        console.log('GALAXY LOADED')
        return result.json();
    } else {
        console.log('GALAXY FAILED')
        return undefined
    }
}