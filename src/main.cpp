#include <cryptopp/rsa.h>
#include <cryptopp/osrng.h>
#include <iostream>
#include <fstream>
#include <string>
#include <sys/mman.h>
#include <cstdio>
#include <unistd.h>
#include <fcntl.h>

int main(){
    using namespace CryptoPP;
    DefaultAutoSeededRNG rng;
    InvertibleRSAFunction irsa;
    irsa.GenerateRandomWithKeySize(rng,2048);

    RSA::PrivateKey privateKey(irsa);
    RSA::PublicKey publicKey(irsa);

    std::string in,enc,out;
    std::cin>>in;

    RSAES_OAEP_SHA_Encryptor e(publicKey);
    StringSource ss1(in,true,
        new PK_EncryptorFilter(rng, e,
            new StringSink(enc)
        )
    );

    RSAES_OAEP_SHA_Decryptor d(privateKey);
    StringSource ss2(enc,true,
        new PK_DecryptorFilter(rng, d,
            new StringSink(out)
        )
    );

    int fd = open("data.txt",O_RDWR | O_TRUNC | O_CREAT, 0644);
    lseek(fd,enc.size()+out.size()-1,SEEK_SET);
    write(fd,"",1);
    char * src = (char*)mmap(0,enc.size()+out.size(),PROT_WRITE|PROT_READ,MAP_SHARED,fd,0);
    memcpy(src,enc.data(),enc.size());
    memcpy(src+enc.size(),out.data(),out.size());
    munmap(src,enc.size()+out.size());
    close(fd);
    return 0;
}
