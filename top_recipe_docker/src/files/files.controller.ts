import {
  Post,
  Get,
  Param,
  Res,
  Controller,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { FileResponseVm } from './view-models/file-response-vm.model';
import { InventariService } from 'src/inventari/inventari.service';
import { ObjectId } from 'mongodb';

@Controller('/files')
export class FilesController {
  constructor(
    private filesService: FilesService,
    private readonly inventariService: InventariService,
  ) {}

  @Post('')
  @UseInterceptors(FilesInterceptor('file'))
  upload(@UploadedFiles() files) {
    console.log(files);
    const response = [];
    files.forEach((file) => {
      const fileReponse = {
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        id: file.id,
        filename: file.filename,
        metadata: file.metadata,
        bucketName: file.bucketName,
        chunkSize: file.chunkSize,
        size: file.size,
        md5: file.md5,
        uploadDate: file.uploadDate,
        contentType: file.contentType,
      };
      response.push(fileReponse);
    });
    return response;
  }

  @Get('info/:id')
  async getFileInfo(@Param('id') id: string): Promise<FileResponseVm> {
    const file = await this.filesService.findInfo(id);
    const filestream = await this.filesService.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file info',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return {
      message: 'File has been detected',
      file: file,
    };
  }

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res) {
    const file = await this.filesService.findInfo(id);
    const filestream = await this.filesService.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    res.header('Content-Type', file.contentType);
    return filestream.pipe(res);
  }

  @Get('download/:id')
  async downloadFile(@Param('id') id: string, @Res() res) {
    const file = await this.filesService.findInfo(id);
    const filestream = await this.filesService.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    res.header('Content-Type', file.contentType);
    res.header('Content-Disposition', 'attachment; filename=' + file.filename);
    return filestream.pipe(res);
  }

  @Get('delete/:id')
  async deleteFile(@Param('id') id: string): Promise<FileResponseVm> {
    const file = await this.filesService.findInfo(id);
    const filestream = await this.filesService.deleteFile(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred during file deletion',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return {
      message: 'File has been deleted',
      file: file,
    };
  }

  @Post('device_info')
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      fileFilter: (req, file, callback) => {
        if (file.mimetype !== 'application/json') {
          return callback(new Error('Solo se permiten archivos JSON'), false);
        }
        callback(null, true);
      },
    }),
  )
  uploadDeviceInfo(@UploadedFiles() files) {
    const response = [];
    files.forEach(async (file) => {
      const fileReponse = {
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        id: file.id,
        filename: file.filename,
        metadata: file.metadata,
        bucketName: file.bucketName,
        chunkSize: file.chunkSize,
        size: file.size,
        md5: file.md5,
        uploadDate: file.uploadDate,
        contentType: file.contentType,
      };
      response.push(fileReponse);
      const fileId = file.id as ObjectId;
      if (!fileId) {
        throw new Error('No se proporcionó un ID de archivo válido.');
      }
      const numSerie = await this.filesService.processJsonStream(fileId);
      this.inventariService.vincularArchivo(numSerie, file.id);
    });
    return response;
  }

  @Get('inventory/:id/device_specs')
  async getDeviceInfoFromInventory(@Param('id') id: number): Promise<any> {
    const inventoryItem = await this.inventariService.getInventari(id);
    if (!inventoryItem) {
      throw new NotFoundException(`Inventario con ID ${id} no encontrado.`);
    }

    const deviceInfoId = inventoryItem.id_device_info;
    if (!deviceInfoId) {
      throw new NotFoundException(
        `El dispositivo con ID ${id} no tiene información de archivo asociada.`,
      );
    }
    const specs = await this.filesService.getRamAndDiskInfo(deviceInfoId);
    return specs;
  }
}
