import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsString, IsNumber, IsArray, IsPositive, IsNotEmpty, IsUrl, ValidateNested } from 'class-validator';

export class CreateUrlDto {
    @IsString()
    @IsNotEmpty()
    @IsUrl()
    url: string;
    
    @IsString()
    @IsNotEmpty()
    label: string;
    
    @IsNumber()
    @IsPositive()
    frequency: number;
    
    @Optional()
    @IsString({ each: true })
    tags: string[];
}