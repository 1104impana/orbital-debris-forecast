export async function getLiveDebris(){

    const response = await fetch("http://127.0.0.1:8000/live-debris");

    return await response.json();

}