import { IsString, IsNumber, IsArray, IsPositive, IsNotEmpty, IsUrl, ValidateNested, IsOptional } from 'class-validator';

export class CreateUrlDto {
    @IsString()
    @IsNotEmpty()
    @IsUrl()
    url: string;
    
    @IsString()
    @IsNotEmpty()
    label: string;
    
    @IsOptional()
    @IsNumber()
    @IsPositive()
    interval: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    threshold: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}