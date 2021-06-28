import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as hbs from 'hbs';
import * as fs from 'fs';
import * as layouts from 'handlebars-layouts';
import * as session from 'express-session'
import flash = require('connect-flash');
import * as passport from 'passport'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', '/public'));
  app.setBaseViewsDir(join(__dirname, '..', '/views'));
  app.setViewEngine('hbs');


  hbs.handlebars.registerHelper('selected', function (options, value) {
    if (options == value) {
      return ' selected';
    } else {
      return '';
    }
  })

  hbs.handlebars.registerHelper('admin', function (role) {
    if (role == 'admin') {
      return 'hidden';
    } else {
      return '';
    }
  })

  app.use(
    session({
      secret: 'nest cats',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());


  hbs.handlebars.registerPartial('layout', hbs.handlebars.compile(fs.readFileSync(join(__dirname, '..', 'views/layouts.hbs'), 'utf-8')));
  hbs.handlebars.registerHelper(layouts(hbs.handlebars));
  hbs.handlebars.registerPartial('index', hbs.handlebars.compile(fs.readFileSync(join(__dirname, '..', 'views/index.hbs'), 'utf-8')));

  await app.listen(3000 || process.env.PORT);
}
bootstrap();
