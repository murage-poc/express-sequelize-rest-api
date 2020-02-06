import {randomBytes, createCipheriv,createDecipheriv} from 'crypto';


type supportedAlgorithms = ["aes-128-cbc", "aes-128-ccm", "aes-128-cfb", "aes-128-cfb1", "aes-128-cfb8",
    "aes-128-ctr", "aes-128-ecb", "aes-128-gcm", "aes-128-ofb", "aes-128-xts", "aes-192-cbc", "aes-192-ccm",
    "aes-192-cfb", "aes-192-cfb1", "aes-192-cfb8", "aes-192-ctr", "aes-192-ecb", "aes-192-gcm", "aes-192-ofb",
    "aes-256-cbc", "aes-256-ccm", "aes-256-cfb", "aes-256-cfb1", "aes-256-cfb8", "aes-256-ctr", "aes-256-ecb",
    "aes-256-gcm", "aes-256-ofb", "aes-256-xts", "aes128", "aes192", "aes256"];


export function encrypt(field: string, alg?: string) {
    let key = randomBytes(16).toString('hex').slice(0,16);
    let nonce = randomBytes(16).toString('hex').slice(0,16);
    let cipher = createCipheriv((alg ? alg : 'aes-128-cbc'), key, nonce);
    let encrypt = cipher.update(field.toString(), 'utf8', 'hex');

    return `${key}$.${nonce}$.${encrypt += cipher.final('hex')}`;
}

export function decrypt(crypt: string, alg?: string) {
    let values= crypt.split('$.');
    if(values.length<3){return}
    let decipher=createDecipheriv((alg ? alg : 'aes-128-cbc'),values[0],new Buffer(values[1]));
    let decrypt=decipher.update(values[2].toString(),'hex','utf8');

    return `${decrypt += decipher.final('utf8')}`;
}


export function verifyPassword(password,hashedPassword): boolean {
    return password===decrypt(hashedPassword);
}

