import { IsArray, IsString } from 'class-validator';

export class DeleteMultipleMediaDto {
    @IsArray()
    @IsString({ each: true })
    ids: string[];
}
