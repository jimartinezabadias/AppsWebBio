import { Pipe, PipeTransform } from '@angular/core';
import { ENCODE_TEST_URL } from 'src/app/encode/constants';

@Pipe({
  name: 'encodeLink'
})
export class EncodeLinkPipe implements PipeTransform
{ 
    transform(userId: string): string
    {
        const BASE_URL: string = window.location.origin;
        return `${BASE_URL}${ENCODE_TEST_URL}/${userId}`;
    }
}